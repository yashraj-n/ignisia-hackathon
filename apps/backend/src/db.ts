import { config as dotenvConfig } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { PrismaClient } from "../generated/prisma/client.ts";

// Ensure root `.env` is loaded even when the server is started from `apps/backend`.
dotenvConfig({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../../../.env"),
});

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
