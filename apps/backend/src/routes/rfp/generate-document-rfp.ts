import { type FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { db } from "../../db";
import { generateFinalDocument } from "../../agent/document-generator";
import type { RFPParserResponse } from "../../agent/parser";
import type { SummariserResponse } from "../../agent/summariser";
import s3 from "../../utils/s3-client";
import { mdToPdf } from "md-to-pdf";

export async function generateDocumentRfpRoute(fastify: FastifyInstance) {
  fastify.post<{ Params: { id: string }; Body: { choices?: { itemIndex: number; selectedOptionIndex: number }[] } }>(
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

      // Extract and validate user choices
      const choices = request.body?.choices ?? [];
      for (const choice of choices) {
        if (
          typeof choice.itemIndex !== "number" || choice.itemIndex < 0 || !Number.isInteger(choice.itemIndex) ||
          typeof choice.selectedOptionIndex !== "number" || choice.selectedOptionIndex < 0 || !Number.isInteger(choice.selectedOptionIndex)
        ) {
          throw fastify.httpErrors.badRequest(
            "Each choice must have a non-negative integer itemIndex and selectedOptionIndex."
          );
        }
      }

      // Set status to generating_document immediately and persist user choices
      await db.rFP.update({
        where: { id },
        data: { status: "generating_document", user_choices: choices },
      });

      try {
        const parsedOutput = rfp.parsed_output as unknown as RFPParserResponse;
        const exploreOutput = rfp.explore_output!;
        const summariseOutput = rfp.summarise_output as unknown as SummariserResponse;

        // Fetch company name for the document
        const company = await db.company.findUnique({ where: { id: rfp.company_id }, select: { name: true } });
        const companyName = company?.name ?? "Our Company";

        // Generate the markdown document
        const markdownContent = await generateFinalDocument({
          parsedOutput,
          exploreOutput,
          summariseOutput,
          companyId: rfp.company_id,
          companyName,
          userChoices: choices,
        });

        // Convert markdown to PDF
        const pdfResult = await mdToPdf(
          { content: markdownContent },
          {
            pdf_options: {
              format: "A4",
              margin: { top: "25mm", bottom: "25mm", left: "20mm", right: "20mm" },
              printBackground: true,
            },
            stylesheet: [
              "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
            ],
            css: `
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                color: #1a1a2e;
                line-height: 1.7;
                font-size: 11pt;
              }
              h1 { color: #0f0f23; font-size: 22pt; border-bottom: 2px solid #D4AF37; padding-bottom: 8px; margin-top: 32px; }
              h2 { color: #1a1a2e; font-size: 16pt; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-top: 24px; }
              h3 { color: #374151; font-size: 13pt; margin-top: 20px; }
              table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 10pt; }
              th { background: #f8f9fa; color: #1a1a2e; font-weight: 600; text-align: left; padding: 10px 12px; border: 1px solid #e5e7eb; }
              td { padding: 8px 12px; border: 1px solid #e5e7eb; }
              tr:nth-child(even) { background: #fafafa; }
              code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
              blockquote { border-left: 4px solid #D4AF37; margin: 16px 0; padding: 8px 16px; background: #fffbeb; color: #92400e; }
              strong { color: #0f0f23; }
              ul, ol { padding-left: 24px; }
              li { margin: 4px 0; }
            `,
            launch_options: { args: ["--no-sandbox", "--disable-setuid-sandbox"] },
          }
        );

        if (!pdfResult?.content) {
          throw new Error("PDF conversion returned empty content");
        }

        const pdfBuffer = pdfResult.content;
        const s3Key = `rfp-documents/${id}/final.pdf`;
        await s3.file(s3Key).write(pdfBuffer, { type: "application/pdf" });

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

