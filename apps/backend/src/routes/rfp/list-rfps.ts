import { type FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { db } from "../../db";

export async function listRfpsRoute(fastify: FastifyInstance) {
  fastify.get(
    "/api/rfp",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const rfps = await db.rFP.findMany({
        where: { company_id: request.companyId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          company_id: true,
          status: true,
          source_email: true,
          information: true,
          parsed_output: true,
          rejection_reason: true,
          rejected_at_step: true,
          final_document_url: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return { ok: true, rfps };
    }
  );
}
