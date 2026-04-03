import type { FastifyInstance } from "fastify";
import { logger } from "../../utils/logger";

export async function nonTestRoute(fastify: FastifyInstance) {
  fastify.get("/api/nonTest", async (request, reply) => {
    logger.info("Non Test");
    return {
      message: "Non Test",
    };
  });
}
