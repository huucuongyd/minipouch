import pg from "pg";
import { createPoolConfig, loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const rawUrl = process.env.SERVICE_URL?.trim() || "";
const pool = new pg.Pool(createPoolConfig());

try {
  const { rows } = await pool.query(
    "select current_database() as db, now()::text as now, version() as version",
  );
  let host = "(discrete DB_*)";
  try {
    if (rawUrl.startsWith("postgres")) host = new URL(rawUrl).host;
  } catch {
    // ignore
  }
  console.log("Postgres OK");
  console.log(`  host:    ${host}`);
  console.log(`  db:      ${rows[0].db}`);
  console.log(`  now:     ${rows[0].now}`);
  console.log(`  version: ${String(rows[0].version).split(",")[0]}`);
  console.log(`  sync:    ${process.env.DB_SYNC || "false"} (migrations only)`);
  process.exitCode = 0;
} catch (error) {
  console.error("Postgres connection failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
