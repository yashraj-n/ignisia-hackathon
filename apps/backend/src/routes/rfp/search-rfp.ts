import { type FastifyInstance } from "fastify";
import z from "zod";
import { authenticate } from "../../middleware/authenticate";
import { db } from "../../db";
import { generateEmbedding } from "../../utils/embedding";

const searchRfpSchema = z.object({
  company_id: z.string(),
  query: z.string(),
});

export async function searchRfpRoute(fastify: FastifyInstance) {
  fastify.post("/api/searchrfp", { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const input = searchRfpSchema.parse(request.body);

      console.log(`⏳ Generating embedding for search query: "${input.query}"...`);
      const queryVector = await generateEmbedding(input.query);
      console.log(`✅ Query embedding generated`);

      const pipeline = [
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryVector,
            numCandidates: 100,
            limit: 5,
            filter: {
              company_id: { $eq: { $oid: input.company_id } }
            }
          }
        },
        {
          $project: {
            _id: 1,
            information: 1,
            score: { $meta: "vectorSearchScore" }
          }
        }
      ];

      const results = await db.$runCommandRaw({
        aggregate: "RFP",
        pipeline: pipeline,
        cursor: {}
      });

      // The result from runCommandRaw for aggregate has the documents in cursor.firstBatch
      const documents = (results as any).cursor?.firstBatch || [];

      return { ok: true, results: documents };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw fastify.httpErrors.badRequest(
          error.issues.map((issue) => issue.message).join(", ")
        );
      }
      fastify.log.error(error);
      throw fastify.httpErrors.internalServerError("Failed to perform vector search");
    }
  });
}
