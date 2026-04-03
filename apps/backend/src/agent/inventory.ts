import { createAgent, HumanMessage, SystemMessage, toolStrategy } from "langchain";
import type { RFPParserResponse } from "./parser";
import { flashLlm } from "./llm";
import z from "zod";
import { INVENTORY_STATS_PROMPT } from "./prompts";
import { db } from "../db";
import s3 from "../utils/s3-client";
import { extractText } from "unpdf";

const IMAGE_MIMES: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
};

type ContentPart =
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string } };

async function readS3File(s3Url: string): Promise<ContentPart> {
    const url = new URL(s3Url);
    const key = url.pathname.slice(1);
    const ext = key.split(".").pop()?.toLowerCase() ?? "";
    const filename = key.split("/").pop() ?? "file";

    if (ext in IMAGE_MIMES) {
        const buf = await s3.file(key).arrayBuffer();
        const base64 = Buffer.from(buf).toString("base64");
        return { type: "image_url", image_url: { url: `data:${IMAGE_MIMES[ext]};base64,${base64}` } };
    }

    if (ext === "pdf") {
        const buf = await s3.file(key).arrayBuffer();
        const { text } = await extractText(new Uint8Array(buf));
        return { type: "text", text: `--- ${filename} ---\n${text}\n--- END ---` };
    }

    const text = await s3.file(key).text();
    return { type: "text", text: `--- ${filename} ---\n${text}\n--- END ---` };
}

export async function generateInventoryStats(inventory: RFPParserResponse, companyId: string){
    const agent = createAgent({
        model: flashLlm,
    });

    const inventoryItems = await db.inventory.findMany({
        where: { companyId }
    });

    const fileParts = await Promise.all(
        inventoryItems.map((item) => readS3File(item.s3_url))
    );

    const content: ContentPart[] = [
        { type: "text", text: `RFP Requirements:\n${inventory.parsedContent}\n\nInventory data from ${inventoryItems.length} file(s):` },
        ...fileParts,
    ];

    const response = await agent.invoke({
        messages: [
            new SystemMessage(INVENTORY_STATS_PROMPT),
            new HumanMessage({ content }),
        ],
    });

    return response;
}