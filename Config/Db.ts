import { Pool } from 'pg';
import dotenv from "dotenv";

dotenv.config();

const isProduction: boolean = process.env.NODE_ENV === "production";

const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.DB_USER as string,
        host: process.env.DB_HOST as string,
        database: process.env.DB_NAME as string,
        password: process.env.DB_PASSWORD as string,
        port: Number(process.env.DB_PORT),
      }
);

pool
  .connect()
  .then(() => console.log("PostgreSQL connected successfully!"))
  .catch((err: Error) => console.error("Database connection error:", err));

export default pool;