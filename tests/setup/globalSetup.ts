import { execSync } from "child_process";
import * as dotenv from "dotenv";
import * as path from "path";

export default async function globalSetup(): Promise<void> {
  dotenv.config({ path: path.resolve(__dirname, "../../.env.test") });

  execSync("npx prisma db push --skip-generate --force-reset", {
    env: { ...process.env, DATABASE_URL: process.env["DATABASE_URL"] },
    stdio: "inherit",
  });
}
