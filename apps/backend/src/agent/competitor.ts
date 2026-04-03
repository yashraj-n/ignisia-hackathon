import { createAgent, HumanMessage, SystemMessage } from "langchain";
import type { RFPParserResponse } from "./parser";
import { flashLlm } from "./llm";
import { COMPETITOR_PRICING_PROMPT } from "./prompts";
import { db } from "../db";
import { readS3File, type ContentPart } from "./s3";

export async function generateCompetitorPricing(parsed: RFPParserResponse, companyId: string) {
    const agent = createAgent({ model: flashLlm });

    const competitors = await db.competitor.findMany({ where: { companyId } });

    const fileParts = await Promise.all(competitors.map((c) => readS3File(c.s3_url)));

    const content: ContentPart[] = [
        {
            type: "text",
            text: `RFP Requirements:\n${parsed.parsedContent}\n\nCompetitor files (${competitors.length} file(s)):\n`,
        },
        ...fileParts,
    ];

    return await agent.invoke({
        messages: [
            new SystemMessage(COMPETITOR_PRICING_PROMPT),
            new HumanMessage({ content }),
        ],
    });
}
