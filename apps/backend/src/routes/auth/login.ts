import type { FastifyInstance } from "fastify";
import z from "zod";
import { loginCompany } from "../../auth/companyAuth";
import { db } from "../../db";

const loginSchema = z.object({
  login_email: z.string().email(),
  login_password: z.string().min(1),
});

export async function loginRoute(fastify: FastifyInstance) {
  fastify.post("/api/login", async (request, reply) => {
    try {
      const input = loginSchema.parse(request.body);
      const result = await loginCompany(input, { db });
      return result;
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw fastify.httpErrors.badRequest("Invalid input");
      }
      const message = err instanceof Error ? err.message : String(err);
      if (message === "INVALID_CREDENTIALS") {
        throw fastify.httpErrors.unauthorized("Invalid credentials");
      } else if (message === "NOT_VERIFIED") {
        throw fastify.httpErrors.forbidden("Email not verified");
      }
      throw err;
    }
  });
}
