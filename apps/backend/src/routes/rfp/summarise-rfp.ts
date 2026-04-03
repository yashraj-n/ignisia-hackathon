import { type FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { db } from "../../db";
import { runSummariseStep } from "../../agent";
import { generateEmbedding } from "../../utils/embedding";
import type { RFPParserResponse } from "../../agent/parser";

export async function summariseRfpRoute(fastify: FastifyInstance) {
  fastify.post<{ Params: { id: string } }>(
    "/api/rfp/:id/summarise",
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

      if (rfp.status !== "explored") {
        throw fastify.httpErrors.badRequest(
          `Cannot summarise RFP in status "${rfp.status}". Expected status: "explored".`
        );
      }

      // Set status to summarising immediately
      await db.rFP.update({
        where: { id },
        data: { status: "summarising" },
      });

      try {
        const parsed = rfp.parsed_output as unknown as RFPParserResponse;
        const exploreMarkdown = rfp.explore_output!;

        const summaryResponse = await runSummariseStep(parsed, exploreMarkdown, rfp.company_id);

        // Generate a fresh embedding from the summarised data
        const summaryText = summaryResponse.items
          .map((item) => `${item.name}: ${item.current_price} — ${item.options.join(", ")}`)
          .join("\n");
        const embedding = await generateEmbedding(summaryText);

        const updated = await db.rFP.update({
          where: { id },
          data: {
            status: "summarised",
            summarise_output: summaryResponse as any,
            information: summaryText,
            embedding,
          },
        });

        return { ok: true, rfp: updated };
      } catch (error) {
        await db.rFP.update({
          where: { id },
          data: { status: "failed" },
        });

        fastify.log.error(error);
        throw fastify.httpErrors.internalServerError("Summarise step failed");
      }
    }
  );
}
