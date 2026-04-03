import { type FastifyInstance } from "fastify";
import z from "zod";
import s3 from "../../utils/s3-client";
import { authenticate } from "../../middleware/authenticate";
import { db } from "../../db";

const addCompetitorSchema = z.object({
    name: z.string(),
    fileData: z.string(),
    mimeType: z.string(),
    extension: z.string(),
});

export async function addCompetitorRoute(fastify: FastifyInstance) {
    fastify.post("/api/company/add-competitor", { preHandler: [authenticate] }, async (request, reply) => {
        try {
            const input = addCompetitorSchema.parse(request.body);
            const buf = Buffer.from(input.fileData, "base64");
            const key = `companies/${request.companyId}/competitors/${input.name}.${input.extension}`;
            const s3File = s3.file(key);
            await s3File.write(buf, { type: input.mimeType });

            const competitor = await db.competitor.create({
                data: {
                    companyId: request.companyId,
                    name: input.name,
                    s3_url: key,
                    information: "",
                },
            });

            return { ok: true, competitor };
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw fastify.httpErrors.badRequest(error.issues.map((issue) => issue.message).join(", "));
            }
            throw error;
        }
    });
}
