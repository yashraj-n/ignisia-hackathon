import { createAgent, HumanMessage, SystemMessage, tool } from "langchain";
import type { RFPParserResponse } from "./parser";
import { flashLlm } from "./llm";
import { COMPETITOR_PRICING_PROMPT } from "./prompts";
import { db } from "../db";
import { readS3File, type ContentPart } from "./s3";
import { getMarketPrice } from "../utils/pricing";
import z from "zod";

const marketPriceTool = tool(
    async (input) => {
        const result = await getMarketPrice(input.productName);
        if (!result) return "No market price data available.";
        return `Market Price for ${input.productName}:\nMedian: $${result.median}\nRange: $${result.min} - $${result.max}\nData points: ${result.count}`;
    },
    {
        name: "get_market_price",
        description: "Fetch real-time market prices for a specific product or service from search engines. Use this to supplement competitor files if pricing data is missing or out of date.",
        schema: z.object({
            productName: z.string().describe("The name of the product or service to search for"),
        }),
    }
);

export async function generateCompetitorPricing(parsed: RFPParserResponse, companyId: string) {
    const agent = createAgent({ 
        model: flashLlm,
        tools: [marketPriceTool],
    });

    const competitors = await db.competitor.findMany({ where: { companyId } });

    const fileParts = await Promise.all(competitors.map((c) => readS3File(c.s3_url)));

    const content: ContentPart[] = [
        {
            type: "text",
            text: `RFP Requirements:\n${parsed.parsedContent}\n\nNOTE: You can use the get_market_price tool to look up live market pricing for any products if competitor files are insufficient.\n\nCompetitor files (${competitors.length} file(s)):\n`,
        },
        ...fileParts,
    ];

    return await agent.invoke(
        {
            messages: [
                new SystemMessage(COMPETITOR_PRICING_PROMPT),
                new HumanMessage({ content }),
            ],
        },
        { recursionLimit: 20 }
    );
}
