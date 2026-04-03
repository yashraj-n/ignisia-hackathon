import { type FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { db } from "../../db";

export async function meRoute(fastify: FastifyInstance) {
    fastify.get("/api/me", { preHandler: [authenticate] }, async (request, reply) => {
        const company = await db.company.findUnique({
            where: { id: request.companyId },
            select: { id: true, name: true, login_email: true, size: true }
        });
        if (!company) {
            throw fastify.httpErrors.notFound("Company not found");
        }
        return { company };
    });
}
