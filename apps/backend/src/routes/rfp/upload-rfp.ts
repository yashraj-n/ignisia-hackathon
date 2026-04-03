import { type FastifyInstance } from "fastify";
import z from "zod";
import { authenticate } from "../../middleware/authenticate";
import { db } from "../../db";
import { generateEmbedding } from "../../utils/embedding";

const uploadRfpSchema = z.object({
  company_id: z.string(),
  status: z.string(),
  information: z.string(),
});

export async function uploadRfpRoute(fastify: FastifyInstance) {
  fastify.post("/api/rfp/upload", { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const input = uploadRfpSchema.parse(request.body);

      console.log(`⏳ Generating embedding for RFP (company: ${input.company_id})...`);
      const embedding = await generateEmbedding(input.information);
      console.log(`✅ Embedding generated (${embedding.length} dimensions)`);

      const rfp = await db.rFP.create({
        data: {
          company_id: input.company_id,
          status: input.status,
          information: input.information,
          embedding: embedding,
        },
      });

      return { ok: true, rfp };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw fastify.httpErrors.badRequest(
          error.issues.map((issue) => issue.message).join(", ")
        );
      }
      throw error;
    }
  });
}
