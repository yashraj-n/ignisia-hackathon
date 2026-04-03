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

      const formattedRfps = rfps.map((rfp) => {
        const statusMap: Record<string, string> = {
          parsed: 'Processing',
          explored: 'Processing',
          summarised: 'Processing',
          Accepted: 'Accepted',
          Rejected: 'Rejected',
          Pending: 'Pending',
          Processing: 'Processing',
        };

        return {
          id: rfp.id,
          title: rfp.information || 'Untitled RFP',
          companyName: 'Acme Corp', // TODO: get from company
          arrivalDate: rfp.createdAt.toISOString().split('T')[0],
          arrivalTime: rfp.createdAt.toTimeString().split(' ')[0],
          status: statusMap[rfp.status] || 'Processing',
          scopeOfWork: rfp.information || '',
          infrastructureDetected: [], // TODO
          assetsDetected: [], // TODO
          missingFields: (rfp.parsed_output as any)?.missingFields || [],
        };
      });

      return { ok: true, rfps: formattedRfps };
    }
  );
}
