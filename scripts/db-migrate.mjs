import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import pg from "pg";
import { createPoolConfig, loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const migrationsDir = resolve(process.cwd(), "db/migrations");
const command = process.argv[2] || "up";

function listMigrationFiles() {
  return readdirSync(migrationsDir)
    .filter((name) => /^\d+_.*\.sql$/i.test(name))
    .sort((a, b) => a.localeCompare(b, "en"));
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function appliedIds(client) {
  const { rows } = await client.query("SELECT id FROM schema_migrations ORDER BY id");
  return new Set(rows.map((row) => row.id));
}

async function status(client) {
  const files = listMigrationFiles();
  const done = await appliedIds(client);
  console.log("Migrations:");
  for (const file of files) {
    const mark = done.has(file) ? "applied" : "pending";
    console.log(`  [${mark}] ${file}`);
  }
  const pending = files.filter((file) => !done.has(file));
  console.log(pending.length ? `${pending.length} pending` : "Database is up to date.");
  return pending;
}

async function migrateUp(client) {
  const files = listMigrationFiles();
  const done = await appliedIds(client);
  const pending = files.filter((file) => !done.has(file));
  if (!pending.length) {
    console.log("No pending migrations.");
    return;
  }

  for (const file of pending) {
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    process.stdout.write(`Applying ${file}... `);
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (id) VALUES ($1)", [file]);
      await client.query("COMMIT");
      console.log("ok");
    } catch (error) {
      await client.query("ROLLBACK");
      console.log("failed");
      throw error;
    }
  }
  console.log(`Applied ${pending.length} migration(s).`);
}

const pool = new pg.Pool(createPoolConfig());
const client = await pool.connect();

try {
  await ensureMigrationsTable(client);
  if (command === "status") {
    await status(client);
  } else if (command === "up") {
    await migrateUp(client);
  } else {
    throw new Error(`Unknown command "${command}". Use: up | status`);
  }
  process.exitCode = 0;
} catch (error) {
  console.error("Migration failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
