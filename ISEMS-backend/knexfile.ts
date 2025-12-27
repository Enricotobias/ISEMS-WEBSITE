import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      timezone: '+07:00', // Penting agar waktu sinkron
    },
    migrations: {
      directory: "./migrations", // Folder tempat menyimpan file migrasi
      extension: "ts"
    }
  }
};

export default config;