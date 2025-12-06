import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../drizzle/schema";

// Ensure the DB file is under data/sqlite.db
const sqlite = new Database("./data/sqlite.db");

export const db = drizzle(sqlite, { schema });
export { schema };
