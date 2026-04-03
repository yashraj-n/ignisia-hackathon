import type { FastifyInstance } from "fastify";
import z from "zod";
import { verifyCompany } from "../../auth/companyAuth";
import { db } from "../../db";

const verifySchema = z.object({
  token: z.string().min(1),
});

export async function verifyRoute(fastify: FastifyInstance) {
  fastify.get("/api/verify", async (request, reply) => {
    try {
      const input = verifySchema.parse(request.query);
      const result = await verifyCompany(input.token, { db });
      return result;
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw fastify.httpErrors.badRequest("Invalid verification token");
      }
      const message = err instanceof Error ? err.message : String(err);
      if (message === "INVALID_TOKEN") {
        throw fastify.httpErrors.badRequest("Invalid verification token");
      } else if (message === "TOKEN_EXPIRED") {
        throw fastify.httpErrors.badRequest("Verification token expired");
      }
      throw err;
    }
  });
}
