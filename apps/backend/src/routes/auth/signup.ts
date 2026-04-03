import type { FastifyInstance } from "fastify";
import z from "zod";
import { signupCompany } from "../../auth/companyAuth";
import { db } from "../../db";

const signupSchema = z.object({
  name: z.string().min(1),
  login_email: z.string().email(),
  login_password: z.string().min(8),
  size: z.number().int().positive(),
});

export async function signupRoute(fastify: FastifyInstance) {
  fastify.post("/api/signup", async (request, reply) => {
    try {
      const input = signupSchema.parse(request.body);
      const result = await signupCompany(input, { db });
      return result;
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw fastify.httpErrors.badRequest(err.issues.map((e) => e.message).join(", "));
      }
      const message = err instanceof Error ? err.message : String(err);
      if (message === "COMPANY_EXISTS") {
        throw fastify.httpErrors.conflict("Company with this login email already exists");
      }
      throw err;
    }
  });
}
