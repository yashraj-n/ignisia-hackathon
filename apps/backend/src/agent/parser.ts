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
    const content: ContentPart[] = [
        { type: "text", text: `${RFP_PARSER_PROMPT}\n\n----- \nEMAIL BODY:\n${email.text || email.html || "(empty)"}` },
    ];

    if (email.attachmentsUrl?.length) {
        const parts = await Promise.all(email.attachmentsUrl.map(readS3File));
        content.push(...parts);
    }

    return await invokeParser(content);
}

export async function parseText(text: string) {
    const content: ContentPart[] = [
        { type: "text", text: `${RFP_PARSER_PROMPT}\n\n----- \nRAW TEXT:\n${text}` },
    ];

    return await invokeParser(content);
}

async function invokeParser(content: ContentPart[]) {
    const agent = createAgent({
        model: flashLlm,
        responseFormat: rfpParserResponseFormat,
    });

    const result = await agent.invoke({ messages: [{ role: "user", content }] });

    if (result && result.structuredResponse && Array.isArray(result.structuredResponse.missingFields)) {
        result.structuredResponse.missingFields = [...new Set(result.structuredResponse.missingFields)];
    }

    return result;
}
