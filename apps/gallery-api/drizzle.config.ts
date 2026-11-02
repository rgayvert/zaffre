import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// load environment variables from .env
dotenv.config();


export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/todo.schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});
