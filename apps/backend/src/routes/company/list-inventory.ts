import { type FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { db } from "../../db";

export async function listInventoryRoute(fastify: FastifyInstance) {
    fastify.get("/api/company/inventory", { preHandler: [authenticate] }, async (request) => {
        const items = await db.inventory.findMany({
            where: { companyId: request.companyId },
            orderBy: { updatedAt: "desc" },
        });
        return { items };
    });
}
