import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_HOST: z.string(),
  DB_NAME: z.string(),
  DB_PORT: z.string().default("1433"),
  DB_ENCRYPT: z.string().default("false"), // true si es Azure SQL
});

export const env = envSchema.parse(process.env);