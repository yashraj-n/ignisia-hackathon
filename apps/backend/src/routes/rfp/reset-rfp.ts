import { type FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { db } from "../../db";

export async function resetRfpRoute(fastify: FastifyInstance) {
  fastify.post<{ Params: { id: string } }>(
    "/api/rfp/:id/reset",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { id } = request.params;

      const rfp = await db.rFP.findUnique({ where: { id } });

      if (!rfp) {
        throw fastify.httpErrors.notFound("RFP not found");
      }

      if (rfp.company_id !== request.companyId) {
        throw fastify.httpErrors.forbidden("RFP does not belong to your company");
      }

      // Reset status to allow re-processing
      const updated = await db.rFP.update({
        where: { id },
        data: { 
          status: "parsed",
          explore_output: null,
          summarise_output: null,
          final_document_url: null,
          user_choices: null
        },
      });

      return { ok: true, rfp: updated };
    }
  );
}
