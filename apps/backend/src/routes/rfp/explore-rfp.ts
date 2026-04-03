import { type FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { db } from "../../db";
import { runExploreStep } from "../../agent";
import type { RFPParserResponse } from "../../agent/parser";

export async function exploreRfpRoute(fastify: FastifyInstance) {
  fastify.post<{ Params: { id: string } }>(
    "/api/rfp/:id/explore",
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

      if (rfp.status !== "parsed") {
        throw fastify.httpErrors.badRequest(
          `Cannot explore RFP in status "${rfp.status}". Expected status: "parsed".`
        );
      }

      // Set status to exploring immediately
      await db.rFP.update({
        where: { id },
        data: { status: "exploring" },
      });

      try {
        const parsed = rfp.parsed_output as unknown as RFPParserResponse;

        const exploreMarkdown = await runExploreStep(parsed, rfp.company_id);

        const updated = await db.rFP.update({
          where: { id },
          data: {
            status: "explored",
            explore_output: exploreMarkdown,
          },
        });

        return { ok: true, rfp: updated };
      } catch (error) {
        await db.rFP.update({
          where: { id },
          data: { status: "failed" },
        });

        fastify.log.error(error);
        throw fastify.httpErrors.internalServerError("Explore step failed");
      }
    }
  );
}
