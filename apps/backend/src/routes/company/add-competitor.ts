import { type FastifyInstance } from "fastify";
import z from "zod";
import s3 from "../../utils/s3-client";
import { authenticate } from "../../middleware/authenticate";
import { db } from "../../db";
import { flashLlm } from "../../agent/llm";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { COMPETITOR_ANALYSIS_PROMPT } from "../../agent/prompts";

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
            const rawBase64 = input.fileData.includes(",")
                ? input.fileData.split(",")[1]!
                : input.fileData;
            const buf = Buffer.from(rawBase64, "base64");
            const key = `companies/${request.companyId}/competitors/${input.name}.${input.extension}`;
            const s3File = s3.file(key);
            await s3File.write(buf, { type: input.mimeType });

            const isImage = input.mimeType.startsWith("image/");
            const userContent = isImage
                ? [
                    { type: "text" as const, text: `Analyze this competitor file: ${input.name}` },
                    { type: "image_url" as const, image_url: { url: `data:${input.mimeType};base64,${rawBase64}` } },
                ]
                : `Analyze this competitor file: ${input.name}\n\n${buf.toString("utf-8")}`;

            const response = await flashLlm.invoke([
                new SystemMessage(COMPETITOR_ANALYSIS_PROMPT),
                new HumanMessage({ content: userContent }),
            ]);
            const information = typeof response.content === "string"
                ? response.content
                : response.content.map((c) => ("text" in c ? c.text : "")).join("");

            const competitor = await db.competitor.create({
                data: {
                    companyId: request.companyId,
                    name: input.name,
                    s3_url: key,
                    information,
                },
            });

            return { ok: true, competitor };
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error(error);
                throw fastify.httpErrors.badRequest(error.issues.map((issue) => issue.message).join(", "));
            }
            throw error;
        }
    });
}
