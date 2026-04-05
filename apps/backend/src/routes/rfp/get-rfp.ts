import { type FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { db } from "../../db";

export async function getRfpRoute(fastify: FastifyInstance) {
  fastify.get<{ Params: { id: string } }>(
    "/api/rfp/:id",
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

      return { ok: true, rfp };
    }
  );

  fastify.get<{ Params: { id: string } }>(
    "/api/rfp/:id/summary",
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

      // Provide a summary from the latest available processing step
      const summariseOutput = rfp.summarise_output as any;
      const parsedOutput = rfp.parsed_output as any;

      const missingRequirements = summariseOutput?.missing_requirements 
        || parsedOutput?.missingFields 
        || [];

      return {
        missingRequirements,
        companyId: rfp.company_id,
        rfpId: rfp.id,
        status: rfp.status
      };
    }
  );
}
