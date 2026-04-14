import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import * as path from "path";

export default async function globalTeardown(): Promise<void> {
  dotenv.config({ path: path.resolve(__dirname, "../../.env.test") });

  const prisma = new PrismaClient({
    datasources: { db: { url: process.env["DATABASE_URL"] } },
  });

  await prisma.$disconnect();
}
