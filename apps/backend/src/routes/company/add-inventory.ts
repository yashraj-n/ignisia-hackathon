import { type FastifyInstance } from "fastify";
import z from "zod";
import s3 from "../../utils/s3-client";
import { authenticate } from "../../middleware/authenticate";
import { db } from "../../db";

const addInventorySchema = z.object({
    name: z.string(),
    fileData: z.string(),
    mimeType: z.string(),
    extension: z.string(),
});

export async function addInventoryRoute(fastify: FastifyInstance) {
    fastify.post("/api/company/add-inventory", { preHandler: [authenticate] }, async (request, reply) => {
        try {
            const input = addInventorySchema.parse(request.body);
            const rawBase64 = input.fileData.includes(",")
                ? input.fileData.split(",")[1]!
                : input.fileData;
            const buf = Buffer.from(rawBase64, "base64");
            const key = `companies/${request.companyId}/inventories/${input.name}.${input.extension}`;
            const s3File = s3.file(key);
            await s3File.write(buf, { type: input.mimeType });

            const inventory = await db.inventory.create({
                data: {
                    companyId: request.companyId,
                    name: input.name,
                    s3_url: key,
                    information: "",
                },
            });

            return { ok: true, inventory };
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw fastify.httpErrors.badRequest(error.issues.map((issue) => issue.message).join(", "));
            }
            throw error;
        }
    });
}
