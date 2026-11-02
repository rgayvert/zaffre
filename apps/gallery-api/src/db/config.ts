import "dotenv/config";
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

//from drizzle-sqlite yt tutorial
const sqlite = new Database(process.env.DB_FILE_NAME);
export const db: BetterSQLite3Database = drizzle(sqlite);
