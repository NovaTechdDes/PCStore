import sql from "mssql";
import { env } from "./env";

const config: sql.config = {
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  server: env.DB_HOST,
  database: env.DB_NAME,
  port: Number(env.DB_PORT),
  options: {
    encrypt: env.DB_ENCRYPT === "true",
    trustServerCertificate: true, // ok en local; en Azure poné encrypt=true y esto en false
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getPool() {
  if (pool) return pool;
  pool = await new sql.ConnectionPool(config).connect();
  console.log("✅ Conectado a SQL Server");
  return pool;
}

export { sql };