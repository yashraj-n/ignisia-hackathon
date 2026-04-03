import { createAgent, toolStrategy, tool, HumanMessage, SystemMessage } from "langchain";
import type { RFPParserResponse } from "./parser";
import z from "zod";
import { flashLlm } from "./llm";
import { SUMMARISER_PROMPT } from "./prompts";
import { db } from "../db";
import { generateEmbedding } from "../utils/embedding";

const summariserOptionSchema = z.object({
    name: z.string().describe("Product or service name as the customer described it in the RFP"),
    current_price: z.string().describe("Our current price from inventory, including currency and unit. Use 'Not listed' if unavailable"),
    options: z.array(z.string()).describe("Array of pricing/strategy options. Each string format: '[Label]: [Price] — [Rationale]'. Minimum 2 options"),
    avg_competitor_price: z.string().nullable().describe("Average competitor price for this item, or null if no competitor data exists"),
    recommended_option_index: z.number().describe("0-based index into the options array for the AI-recommended option"),
});

const summariserResponseFormat = toolStrategy(z.object({
    items: z.array(summariserOptionSchema).describe("One entry per product/service the customer is requesting"),
    data: z.string().describe("Comprehensive summary of all relevant information from all sources for this item — customer requirements, our position, competitive landscape, past RFP insights, strategic reasoning, and non-pricing considerations"),

}));

export type SummariserItem = z.infer<typeof summariserOptionSchema>;
export type SummariserResponse = { items: SummariserItem[] };

interface SummariserInput {
    parsed: RFPParserResponse;
    inventoryResult: any;
    competitorResult: any;
    companyId: string;
}

const MAX_SEARCH_CALLS = 2;

function createSemanticSearchTool(companyId: string) {
    let callCount = 0;

    return tool(
        async (input: { query: string }) => {
            callCount++;
            if (callCount > MAX_SEARCH_CALLS) {
                console.log(`[summariser] ⛔ Search call #${callCount} blocked (max ${MAX_SEARCH_CALLS})`);
                return "Maximum search limit reached (2 calls). Proceed with the data you already have.";
            }

            try {
                console.log(`[summariser] 🔍 Search call #${callCount}/${MAX_SEARCH_CALLS} — query: "${input.query.slice(0, 100)}..."`);
                const queryVector = await generateEmbedding(input.query);

                // Pass 1: search within this company's RFPs
                const companyPipeline: any[] = [
                    {
                        $vectorSearch: {
                            index: "vector_index",
                            path: "embedding",
                            queryVector: queryVector,
                            numCandidates: 100,
                            limit: 5,
                            filter: { company_id: { $eq: { $oid: companyId } } },
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            information: 1,
                            status: 1,
                            company_id: 1,
                            score: { $meta: "vectorSearchScore" }
                        }
                    }
                ];

                const companyResults = await db.$runCommandRaw({
                    aggregate: "RFP",
                    pipeline: companyPipeline,
                    cursor: {}
                });

                let documents = (companyResults as any).cursor?.firstBatch || [];
                console.log(`[summariser] Company-specific results: ${documents.length}`);

                // Pass 2: if fewer than 2, broaden to global search
                if (documents.length < 2) {
                    console.log(`[summariser] Falling back to global search`);
                    const globalPipeline: any[] = [
                        {
                            $vectorSearch: {
                                index: "vector_index",
                                path: "embedding",
                                queryVector: queryVector,
                                numCandidates: 100,
                                limit: 5,
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                information: 1,
                                status: 1,
                                company_id: 1,
                                score: { $meta: "vectorSearchScore" }
                            }
                        }
                    ];

                    const globalResults = await db.$runCommandRaw({
                        aggregate: "RFP",
                        pipeline: globalPipeline,
                        cursor: {}
                    });

                    const globalDocs = (globalResults as any).cursor?.firstBatch || [];

                    // Dedupe by _id
                    const seenIds = new Set(documents.map((d: any) => String(d._id)));
                    for (const doc of globalDocs) {
                        if (!seenIds.has(String(doc._id))) {
                            documents.push(doc);
                            seenIds.add(String(doc._id));
                        }
                        if (documents.length >= 5) break;
                    }
                    console.log(`[summariser] After global fallback: ${documents.length} results`);
                }

                if (documents.length === 0) {
                    return "No past RFP responses found in the database for this query.";
                }

                return documents
                    .map((doc: any, i: number) => {
                        const isOwn = doc.company_id?.$oid === companyId || doc.company_id === companyId;
                        const source = isOwn ? "own company" : "cross-company";
                        return `--- Past RFP #${i + 1} (similarity: ${doc.score?.toFixed(3) ?? "N/A"}, status: ${doc.status ?? "unknown"}, source: ${source}) ---\n${doc.information}\n--- END ---`;
                    })
                    .join("\n\n");
            } catch (error) {
                console.error("[summariser] Semantic search tool error:", error);
                return "Semantic search failed. Proceed without past RFP data.";
            }
        },
        {
            name: "search_past_rfps",
            description: "Search through previous RFP responses using semantic similarity. Use this to find past deals similar to what the customer is requesting. You can search by product name, service type, or pricing keywords. You can call this at most 2 times total, so make your queries count. Each call returns up to 5 similar past RFP responses.",
            schema: z.object({
                query: z.string().describe("The search query — describe what you're looking for in past RFP responses. Be specific. Examples: 'enterprise firewall pricing', 'cloud hosting SLA terms', 'bulk SSL certificate discount'"),
            }),
        }
    );
}

function extractTextFromResult(result: any): string {
    if (typeof result === "string") return result;

    const lastMessage = result?.messages?.at(-1);
    if (lastMessage) {
        const content = lastMessage.content;
        if (typeof content === "string") return content;
        if (Array.isArray(content)) {
            return content
                .map((part: any) => {
                    if (typeof part === "string") return part;
                    if (part?.text) return part.text;
                    return "";
                })
                .filter(Boolean)
                .join("\n");
        }
    }

    return JSON.stringify(result, null, 2);
}

export async function generateSummary(input: SummariserInput) {
    const searchTool = createSemanticSearchTool(input.companyId);

    const agent = createAgent({
        model: flashLlm,
        tools: [searchTool],
        responseFormat: summariserResponseFormat,
    });

    // Extract text content from agent results
    const inventoryText = extractTextFromResult(input.inventoryResult);
    const competitorText = extractTextFromResult(input.competitorResult);

    const userMessage = `
=======================================================
SECTION 1: PARSED RFP REQUIREMENTS (from Parser Agent)
=======================================================

${input.parsed.parsedContent}

Missing Fields Flagged by Parser:
${input.parsed.missingFields.length > 0 ? input.parsed.missingFields.map((f, i) => `  ${i + 1}. ${f}`).join("\n") : "  None flagged."}

=======================================================
SECTION 2: INVENTORY ANALYSIS (from Inventory Agent)
=======================================================

${inventoryText}

=======================================================
SECTION 3: COMPETITOR PRICING (from Competitor Agent)
=======================================================

${competitorText}

=======================================================
INSTRUCTIONS:
1. First, use the search_past_rfps tool to find relevant past RFP responses. Search for each major product/service the customer is requesting. You can call the tool multiple times with different queries.
2. After gathering past RFP data, produce your structured decision for each product/service. Do NOT return an empty items array.
=======================================================`;

    return await agent.invoke({
        messages: [
            new SystemMessage(SUMMARISER_PROMPT),
            new HumanMessage({ content: userMessage }),
        ],
    });
}
