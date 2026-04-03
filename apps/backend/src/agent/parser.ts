import { createAgent, providerStrategy } from "langchain"
import type { EmailEvent } from "common";
import z from "zod";
import s3 from "../utils/s3-client";
import { flashLlm } from "./llm";
import { RFP_PARSER_PROMPT } from "./prompts";
import { extractText } from "unpdf";

const rfpParserResponseFormat = providerStrategy(z.object({
    parsedContent: z.string().describe("The parsed content of the RFP"),
    missingFields: z.array(z.string()).describe("The missing fields in the RFP"),
}));

const TEXT_EXTENSIONS = new Set(["txt", "csv", "json", "xml", "html", "htm", "md"]);

async function fetchAttachmentText(s3Url: string): Promise<string> {
    const url = new URL(s3Url);
    const key = url.pathname.slice(1);
    const ext = key.split(".").pop()?.toLowerCase() ?? "";
    const filename = key.split("/").pop() ?? "attachment";

    if (ext === "pdf") {
        const buf = await s3.file(key).arrayBuffer();
        const { text } = await extractText(new Uint8Array(buf));
        return `--- ATTACHMENT: ${filename} ---\n${text}\n--- END ATTACHMENT ---`;
    }

    if (TEXT_EXTENSIONS.has(ext)) {
        const text = await s3.file(key).text();
        return `--- ATTACHMENT: ${filename} ---\n${text}\n--- END ATTACHMENT ---`;
    }

    return `--- ATTACHMENT: ${filename} ---\n[Unsupported file type: .${ext}]\n--- END ATTACHMENT ---`;
}

export async function parseEmail(email: EmailEvent) {
    const agent = createAgent({
        model: flashLlm,
        responseFormat: rfpParserResponseFormat,
    });

    let message = `${RFP_PARSER_PROMPT}\n\n---\nEMAIL BODY:\n${email.text || email.html || "(empty)"}`;

    if (email.attachmentsUrl?.length) {
        const texts = await Promise.all(email.attachmentsUrl.map(fetchAttachmentText));
        message += `\n\n${texts.join("\n\n")}`;
    }

    return await agent.invoke({ messages: [{ role: "user", content: message }] });
}
