import z from "zod";
import { ORPCError, os } from "@orpc/server";
import type { Logger } from "pino";

const testSchema = z.object({
  name: z.string(),
  age: z.number(),
});
const base = os.$context<{
  logger: Logger;
}>();

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
