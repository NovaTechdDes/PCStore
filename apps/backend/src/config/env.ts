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
  JWT_SECRET: z.string().min(10, "JWT_SECRET debe tener al menos 10 caracteres"),
  JWT_EXPIRES_IN: z.string().default("8h"),
});

export const env = envSchema.parse(process.env);