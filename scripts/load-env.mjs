import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

export function loadProjectEnv() {
  loadEnvFile(resolve(process.cwd(), ".env"));
}

export function databaseUrl() {
  const sync = (process.env.DB_SYNC || "false").trim().toLowerCase();
  if (sync === "true" || sync === "1" || sync === "on") {
    throw new Error(
      "DB_SYNC is enabled. This project uses SQL migrations only — set DB_SYNC=false.",
    );
  }

  const service = process.env.SERVICE_URL?.trim() || "";
  if (service.startsWith("postgres://") || service.startsWith("postgresql://")) {
    return service;
  }
  const host = process.env.DB_HOST?.trim();
  const user = process.env.DB_USER?.trim();
  const password = process.env.DB_PASS?.trim();
  const database = process.env.DB_NAME?.trim();
  if (host && user && password && database) {
    const port = process.env.DB_PORT?.trim() || "5432";
    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
  }
  throw new Error("Missing SERVICE_URL or DB_* vars");
}

export function readSslMode(connectionString) {
  if (process.env.DB_SSL_MODE?.trim()) return process.env.DB_SSL_MODE.trim().toLowerCase();
  try {
    return new URL(connectionString).searchParams.get("sslmode")?.toLowerCase() || "disable";
  } catch {
    return "disable";
  }
}

export function stripSslParams(connectionString) {
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

export function normalizePem(value) {
  let pem = value.trim();
  if (
    (pem.startsWith('"') && pem.endsWith('"')) ||
    (pem.startsWith("'") && pem.endsWith("'"))
  ) {
    pem = pem.slice(1, -1);
  }
  return pem.replace(/\r\n/g, "\n").replace(/\\n/g, "\n").trim();
}

export function sslConfig(mode) {
  if (mode === "disable" || mode === "false" || mode === "off") return false;
  const caRaw = process.env.DB_CA_CERT?.trim();
  const ca = caRaw ? normalizePem(caRaw) : "";
  if (ca) return { rejectUnauthorized: true, ca };
  if (mode === "require" || mode === "prefer" || mode === "allow") {
    return { rejectUnauthorized: false };
  }
  return { rejectUnauthorized: true };
}

export function createPoolConfig() {
  const rawUrl = databaseUrl();
  const mode = readSslMode(rawUrl);
  return {
    connectionString: stripSslParams(rawUrl),
    max: Number(process.env.DB_CONNECTION_LIMIT || 10),
    ssl: sslConfig(mode),
    connectionTimeoutMillis: 12000,
  };
}
