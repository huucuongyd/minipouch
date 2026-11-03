import { Pool, type PoolClient, type PoolConfig, type QueryResult, type QueryResultRow } from "pg";

const globalForPg = globalThis as typeof globalThis & {
  __minipouchPgPool?: Pool;
};

function optional(name: string, fallback = ""): string {
  return process.env[name]?.trim() || fallback;
}

/**
 * Normalize a PEM CA cert from env (Aiven `ca.pem` style).
 * Vercel may store real newlines, or literal `\n` escape sequences.
 */
function normalizePem(value: string): string {
  let pem = value.trim();
  if (
    (pem.startsWith('"') && pem.endsWith('"')) ||
    (pem.startsWith("'") && pem.endsWith("'"))
  ) {
    pem = pem.slice(1, -1);
  }
  return pem.replace(/\r\n/g, "\n").replace(/\\n/g, "\n").trim();
}

function parseConnectionLimit(raw: string): number {
  const limit = Number(raw);
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new Error(`DB_CONNECTION_LIMIT không hợp lệ: ${raw}`);
  }
  // On Vercel each function instance opens its own pool — keep it small.
  return Math.min(limit, process.env.VERCEL ? 5 : limit);
}

function readSslMode(connectionString?: string): string {
  const fromEnv = optional("DB_SSL_MODE");
  if (fromEnv) return fromEnv.toLowerCase();

  if (connectionString) {
    try {
      const fromUrl = new URL(connectionString).searchParams.get("sslmode");
      if (fromUrl) return fromUrl.toLowerCase();
    } catch {
      // ignore malformed URI; getDatabaseUrl() already validates sources
    }
  }

  return process.env.VERCEL ? "require" : "disable";
}

/**
 * `pg` currently maps sslmode=require → verify-full. Strip SSL params from the
 * URI and configure TLS on the Pool instead so Aiven `sslmode=require` works.
 */
function stripSslParams(connectionString: string): string {
  try {
    const url = new URL(connectionString);
    url.searchParams.delete("sslmode");
    url.searchParams.delete("sslrootcert");
    url.searchParams.delete("sslcert");
    url.searchParams.delete("sslkey");
    url.searchParams.delete("uselibpqcompat");
    return url.toString();
  } catch {
    return connectionString;
  }
}

function sslConfig(mode: string): PoolConfig["ssl"] {
  if (mode === "disable" || mode === "false" || mode === "off") {
    return false;
  }

  const caRaw = optional("DB_CA_CERT");
  const ca = caRaw ? normalizePem(caRaw) : "";

  // Prefer verifying with the pasted Aiven project CA when available.
  if (ca) {
    return { rejectUnauthorized: true, ca };
  }

  if (mode === "require" || mode === "prefer" || mode === "allow") {
    // Encrypt without verifying the server certificate.
    return { rejectUnauthorized: false };
  }

  return { rejectUnauthorized: true };
}

/**
 * Schema changes go through `npm run db:migrate` only.
 * Never enable ORM-style auto sync in this project.
 */
export function assertMigrationsOnly(): void {
  const sync = optional("DB_SYNC", "false").toLowerCase();
  if (sync === "true" || sync === "1" || sync === "on") {
    throw new Error(
      "DB_SYNC is enabled. Turn it off (DB_SYNC=false) and use SQL migrations under db/migrations/.",
    );
  }
}

/** Postgres URI from Vercel (`SERVICE_URL`) or built from discrete DB_* vars. */
export function getDatabaseUrl(): string {
  assertMigrationsOnly();

  const fromServiceUrl = optional("SERVICE_URL");
  if (fromServiceUrl.startsWith("postgres://") || fromServiceUrl.startsWith("postgresql://")) {
    return fromServiceUrl;
  }

  const host = optional("DB_HOST");
  const user = optional("DB_USER");
  const password = optional("DB_PASS");
  const database = optional("DB_NAME");
  if (host && user && password && database) {
    const port = optional("DB_PORT", "5432");
    const auth = `${encodeURIComponent(user)}:${encodeURIComponent(password)}`;
    return `postgresql://${auth}@${host}:${port}/${database}`;
  }

  throw new Error(
    "Thiếu kết nối Postgres. Đặt SERVICE_URL (postgres://…) hoặc DB_HOST/DB_USER/DB_PASS/DB_NAME.",
  );
}

export function getDatabaseConfig(): PoolConfig {
  const rawUrl = getDatabaseUrl();
  const mode = readSslMode(rawUrl);
  return {
    connectionString: stripSslParams(rawUrl),
    max: parseConnectionLimit(optional("DB_CONNECTION_LIMIT", "10")),
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    ssl: sslConfig(mode),
  };
}

export function getPool(): Pool {
  if (!globalForPg.__minipouchPgPool) {
    const pool = new Pool(getDatabaseConfig());
    pool.on("error", (error) => {
      console.error("[NuBeNa] Postgres pool error:", error);
    });
    globalForPg.__minipouchPgPool = pool;
  }
  return globalForPg.__minipouchPgPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, params);
}

export async function withClient<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

/** Smoke-check used by scripts / health routes. */
export async function pingDatabase(): Promise<{ ok: true; now: string }> {
  const result = await query<{ now: string }>("select now()::text as now");
  return { ok: true, now: result.rows[0]?.now ?? "" };
}
