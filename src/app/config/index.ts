import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

if (process.env["NODE_ENV"] !== "test") {
  dotenv.config({ path: path.join(process.cwd(), ".env") });
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  DATABASE_URL: z.string({ required_error: "DATABASE_URL is required" }),
  JWT_ACCESS_SECRET: z
    .string({ required_error: "JWT_ACCESS_SECRET is required" })
    .min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z
    .string({ required_error: "JWT_REFRESH_SECRET is required" })
    .min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_ACCESS_EXPIRES_IN: z.string({
    required_error: "JWT_ACCESS_EXPIRES_IN is required",
  }),
  JWT_REFRESH_EXPIRES_IN: z.string({
    required_error: "JWT_REFRESH_EXPIRES_IN is required",
  }),
  SALT_ROUNDS: z.coerce
    .number({ required_error: "SALT_ROUNDS is required" })
    .int()
    .min(
      process.env["NODE_ENV"] === "test" ? 1 : 8,
      "SALT_ROUNDS must be at least 8 in non-test environments",
    ),
  REDIS_URL: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:\n",
    JSON.stringify(parsed.error.format(), null, 2),
  );
  process.exit(1);
}

export const config = parsed.data;
