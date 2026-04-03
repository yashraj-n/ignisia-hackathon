import { createAgent, toolStrategy } from "langchain"
import type { EmailEvent } from "common";
import z from "zod";
import { flashLlm } from "./llm";
import { RFP_PARSER_PROMPT } from "./prompts";
import { readS3File, type ContentPart } from "./s3";

export const rfpParserResponseFormat = toolStrategy(z.object({
    parsedContent: z.string().describe("The parsed content of the RFP"),
    missingFields: z.array(z.string()).describe("The missing fields in the RFP"),
}));

export type RFPParserResponse = {
    parsedContent: string;
    missingFields: string[];
};

export async function parseEmail(email: EmailEvent) {
    const agent = createAgent({
        model: flashLlm,
        responseFormat: rfpParserResponseFormat,
    });

    const content: ContentPart[] = [
        { type: "text", text: `${RFP_PARSER_PROMPT}\n\n---\nEMAIL BODY:\n${email.text || email.html || "(empty)"}` },
    ];

    if (email.attachmentsUrl?.length) {
        const parts = await Promise.all(email.attachmentsUrl.map(readS3File));
        content.push(...parts);
    }

    return await agent.invoke({ messages: [{ role: "user", content }] });
}
