import { createClient } from "@libsql/client";
import Database from "better-sqlite3";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import * as schema from "../drizzle/schema";

// Use Turso/libSQL in production when env vars are present; fallback to local SQLite in dev
const libsqlUrl = process.env.LIBSQL_URL;
const libsqlToken = process.env.LIBSQL_AUTH_TOKEN;

let db: ReturnType<typeof drizzleSqlite> | ReturnType<typeof drizzleLibsql>;

if (libsqlUrl) {
  const client = createClient({ url: libsqlUrl, authToken: libsqlToken });
  db = drizzleLibsql(client, { schema });
} else {
  const sqlite = new Database("./data/sqlite.db");
  db = drizzleSqlite(sqlite, { schema });
}

export { db, schema };
