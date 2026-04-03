import { createAgent, toolStrategy } from "langchain"
import type { EmailEvent } from "common";
import z from "zod";
import s3 from "../utils/s3-client";
import { flashLlm } from "./llm";
import { RFP_PARSER_PROMPT } from "./prompts";
import { extractText } from "unpdf";

export const rfpParserResponseFormat = toolStrategy(z.object({
    parsedContent: z.string().describe("The parsed content of the RFP"),
    missingFields: z.array(z.string()).describe("The missing fields in the RFP"),
}));

export type RFPParserResponse = {
    parsedContent: string;
    missingFields: string[];
};

const IMAGE_MIMES: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
};

const TEXT_EXTENSIONS = new Set(["txt", "csv", "json", "xml", "html", "htm", "md"]);

type ContentPart =
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string } };

async function fetchAttachmentPart(s3Url: string): Promise<ContentPart> {
    const url = new URL(s3Url);
    const key = url.pathname.slice(1);
    const ext = key.split(".").pop()?.toLowerCase() ?? "";
    const filename = key.split("/").pop() ?? "attachment";

    if (ext in IMAGE_MIMES) {
        const buf = await s3.file(key).arrayBuffer();
        const base64 = Buffer.from(buf).toString("base64");
        return { type: "image_url", image_url: { url: `data:${IMAGE_MIMES[ext]};base64,${base64}` } };
    }

    if (ext === "pdf") {
        const buf = await s3.file(key).arrayBuffer();
        const { text } = await extractText(new Uint8Array(buf));
        return { type: "text", text: `--- ATTACHMENT: ${filename} ---\n${text}\n--- END ATTACHMENT ---` };
    }

    if (TEXT_EXTENSIONS.has(ext)) {
        const text = await s3.file(key).text();
        return { type: "text", text: `--- ATTACHMENT: ${filename} ---\n${text}\n--- END ATTACHMENT ---` };
    }

    return { type: "text", text: `--- ATTACHMENT: ${filename} ---\n[Unsupported file type: .${ext}]\n--- END ATTACHMENT ---` };
}

export async function parseEmail(email: EmailEvent) {
    const agent = createAgent({
        model: flashLlm,
        responseFormat: rfpParserResponseFormat,
    });

    const content: ContentPart[] = [
        { type: "text", text: `${RFP_PARSER_PROMPT}\n\n---\nEMAIL BODY:\n${email.text || email.html || "(empty)"}` },
    ];

    if (email.attachmentsUrl?.length) {
        const parts = await Promise.all(email.attachmentsUrl.map(fetchAttachmentPart));
        content.push(...parts);
    }

    return await agent.invoke({ messages: [{ role: "user", content }] });
}
