import { createAgent, HumanMessage, SystemMessage } from "langchain";
import { flashLlm } from "./llm";
import { FINAL_DOCUMENT_PROMPT } from "./prompts";
import type { RFPParserResponse } from "./parser";
import type { SummariserResponse } from "./summariser";

export interface GenerateDocumentInput {
    parsedOutput: RFPParserResponse;
    exploreOutput: string;
    summariseOutput: SummariserResponse;
    companyId: string;
}

/**
 * Generates a professional RFP response document in markdown format
 * using all three prior step outputs.
 * Returns the markdown string.
 */
export async function generateFinalDocument(input: GenerateDocumentInput): Promise<string> {
    const agent = createAgent({ model: flashLlm });

    const summariseText = input.summariseOutput.items
        .map((item, i) => {
            const recommended = item.options[item.recommended_option_index] || item.options[0];
            return `### ${item.name}
- Current Price: ${item.current_price}
- Average Competitor Price: ${item.avg_competitor_price ?? "N/A"}
- Recommended Option: ${recommended}
- All Options:
${item.options.map((opt, j) => `  ${j === item.recommended_option_index ? "→" : " "} ${j + 1}. ${opt}`).join("\n")}`;
        })
        .join("\n\n");

    const userMessage = `
=======================================================
SECTION 1: PARSED RFP REQUIREMENTS
=======================================================

${input.parsedOutput.parsedContent}

Missing Fields:
${input.parsedOutput.missingFields.length > 0 ? input.parsedOutput.missingFields.map((f, i) => `  ${i + 1}. ${f}`).join("\n") : "  None."}

=======================================================
SECTION 2: EXPLORE OUTPUT (Inventory + Competitor Data)
=======================================================

${input.exploreOutput}

=======================================================
SECTION 3: SUMMARISE OUTPUT (Strategic Pricing Decisions)
=======================================================

${summariseText}

=======================================================
INSTRUCTIONS:
Generate the full RFP response document as specified in your system prompt.
Use the recommended options for pricing in the pricing table.
=======================================================`;

    const result = await agent.invoke({
        messages: [
            new SystemMessage(FINAL_DOCUMENT_PROMPT),
            new HumanMessage({ content: userMessage }),
        ],
    });

    // Extract the text content from the agent result
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
