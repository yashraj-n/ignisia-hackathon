import z from "zod";
import { os } from "@orpc/server";
import type { PrismaClient } from "../generated/prisma/client.ts";

export interface AppLogger {
  info(msg: string, ...args: unknown[]): void;
  error(msg: string, ...args: unknown[]): void;
  warn(msg: string, ...args: unknown[]): void;
  debug(msg: string, ...args: unknown[]): void;
}

export interface AppContext {
  logger: AppLogger;
  db: PrismaClient;
}

export const base = os.$context<AppContext>();

const testSchema = z.object({
  name: z.string(),
  age: z.number(),
});

export const nonTest = base.route({ method: "GET" }).handler(({ context }) => {
  context.logger.info("Non Test");
  return {
    message: "Non Test",
  };
});

export const test = base.input(testSchema).handler(({ input, context }) => {
  context.logger.info("Test");
  return {
    name: input.name,
    age: input.age,
  };
});

export const router = {
  test,
  nonTest,
};

export type AppRouter = typeof router;
