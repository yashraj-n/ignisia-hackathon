import { type FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { db } from "../../db";
import { generateFinalDocument } from "../../agent/document-generator";
import type { RFPParserResponse } from "../../agent/parser";
import type { SummariserResponse } from "../../agent/summariser";
import s3 from "../../utils/s3-client";

export async function generateDocumentRfpRoute(fastify: FastifyInstance) {
  fastify.post<{ Params: { id: string } }>(
    "/api/rfp/:id/generate-document",
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

      if (rfp.status !== "summarised") {
        throw fastify.httpErrors.badRequest(
          `Cannot generate document for RFP in status "${rfp.status}". Expected status: "summarised".`
        );
      }

      // Set status to generating_document immediately
      await db.rFP.update({
        where: { id },
        data: { status: "generating_document" },
      });

      try {
        const parsedOutput = rfp.parsed_output as unknown as RFPParserResponse;
        const exploreOutput = rfp.explore_output!;
        const summariseOutput = rfp.summarise_output as unknown as SummariserResponse;

        // Generate the markdown document
        const markdownContent = await generateFinalDocument({
          parsedOutput,
          exploreOutput,
          summariseOutput,
          companyId: rfp.company_id,
        });

        // Upload markdown document to S3
        const s3Key = `rfp-documents/${id}/final.md`;
        await s3.file(s3Key).write(markdownContent);

        // Construct the S3 URL
        const bucket = process.env.S3_BUCKET;
        const region = process.env.AWS_REGION;
        const s3Url = `https://${bucket}.s3.${region}.amazonaws.com/${s3Key}`;

        const updated = await db.rFP.update({
          where: { id },
          data: {
            status: "completed",
            final_document_url: s3Url,
          },
        });

        return { ok: true, rfp: updated, documentUrl: s3Url };
      } catch (error) {
        await db.rFP.update({
          where: { id },
          data: { status: "failed" },
        });

        fastify.log.error(error);
        throw fastify.httpErrors.internalServerError("Document generation failed");
      }
    }
  );
}
