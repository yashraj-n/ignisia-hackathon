import { type FastifyInstance } from "fastify";
import z from "zod";
import { authenticate } from "../../middleware/authenticate";
import { db } from "../../db";

const rejectSchema = z.object({
  reason: z.string().min(1, "Rejection reason is required"),
});

/**
 * Derives the rejected status and step name from the current RFP status.
 */
function deriveRejection(currentStatus: string): { status: string; step: string } | null {
  switch (currentStatus) {
    case "parsed":
      return { status: "parse_rejected", step: "parsing" };
    case "explored":
      return { status: "explore_rejected", step: "exploring" };
    case "summarised":
      return { status: "summarise_rejected", step: "summarising" };
    default:
      return null;
  }
}

export async function rejectRfpRoute(fastify: FastifyInstance) {
  fastify.post<{ Params: { id: string } }>(
    "/api/rfp/:id/reject",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { id } = request.params;
      const body = rejectSchema.parse(request.body);

      const rfp = await db.rFP.findUnique({ where: { id } });

      if (!rfp) {
        throw fastify.httpErrors.notFound("RFP not found");
      }

      if (rfp.company_id !== request.companyId) {
        throw fastify.httpErrors.forbidden("RFP does not belong to your company");
      }

      const rejection = deriveRejection(rfp.status);
      if (!rejection) {
        throw fastify.httpErrors.badRequest(
          `Cannot reject RFP in status "${rfp.status}". Rejectable statuses: parsed, explored, summarised.`
        );
      }

      const updated = await db.rFP.update({
        where: { id },
        data: {
          status: rejection.status,
          rejection_reason: body.reason,
          rejected_at_step: rejection.step,
        },
      });

      return { ok: true, rfp: updated };
    }
  );
}
