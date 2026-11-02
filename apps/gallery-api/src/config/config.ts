import dotenv from "dotenv";

dotenv.config();

interface Env {
  DB_FILE_NAME: string;
  PORT: number;
}

export const config: Env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  DB_FILE_NAME: process.env.DB_URL ? process.env.DB_URL : "value_not_provided",
};
