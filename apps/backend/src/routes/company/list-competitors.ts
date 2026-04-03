import { type FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { db } from "../../db";

export async function listCompetitorsRoute(fastify: FastifyInstance) {
    fastify.get("/api/company/competitors", { preHandler: [authenticate] }, async (request) => {
        const competitors = await db.competitor.findMany({
            where: { companyId: request.companyId },
            orderBy: { updatedAt: "desc" },
        });
        return { competitors };
    });
}
