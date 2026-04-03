import type { FastifyInstance } from "fastify";
import z from "zod";
import { logger } from "../../utils/logger";

export async function testRoute(fastify: FastifyInstance) {
  fastify.get("/api/test", async (request, reply) => {
    logger.info("Test");
    const testSchema = z.object({
      name: z.string(),
      age: z.coerce.number(),
    });
    const input = testSchema.parse(request.query);
    return {
      name: input.name,
      age: input.age,
    };
  });
}
