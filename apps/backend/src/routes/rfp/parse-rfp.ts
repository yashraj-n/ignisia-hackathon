import { type FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { db } from "../../db";
import { runParseTextStep } from "../../agent";
import { generateEmbedding } from "../../utils/embedding";

export async function parseRfpRoute(fastify: FastifyInstance) {
  fastify.post<{ Params: { id: string } }>(
    "/api/rfp/:id/parse",
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

      // Initial parsing step
      try {
        const parsed = await runParseTextStep(rfp.information);

        // Generate embedding from parsedContent (Gemini-cleaned)
        const embedding = await generateEmbedding(parsed.parsedContent);

        const updated = await db.rFP.update({
          where: { id },
          data: {
            status: "parsed",
            parsed_output: parsed as any,
            information: parsed.parsedContent, // overwrite with cleaned content
            embedding,
          },
        });

        return { ok: true, rfp: updated };
      } catch (error) {
        fastify.log.error(error);
        throw fastify.httpErrors.internalServerError("Parsing step failed");
      }
    }
  );
}
