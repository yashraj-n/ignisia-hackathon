import { createAgent, HumanMessage, SystemMessage } from "langchain";
import { flashLlm } from "./llm";
import { FINAL_DOCUMENT_PROMPT } from "./prompts";
import type { RFPParserResponse } from "./parser";
import type { SummariserResponse } from "./summariser";

export interface UserChoice {
    itemIndex: number;
    selectedOptionIndex: number;
}

export interface GenerateDocumentInput {
    parsedOutput: RFPParserResponse;
    exploreOutput: string;
    summariseOutput: SummariserResponse;
    companyId: string;
    companyName: string;
    userChoices?: UserChoice[];
}


export async function generateFinalDocument(input: GenerateDocumentInput): Promise<string> {
    const agent = createAgent({ model: flashLlm });

    const summariseText = input.summariseOutput.items
        .map((item, i) => {
            const userChoice = input.userChoices?.find(c => c.itemIndex === i);
            const selectedIndex = userChoice !== undefined
                && userChoice.selectedOptionIndex >= 0
                && userChoice.selectedOptionIndex < item.options.length
                ? userChoice.selectedOptionIndex
                : item.recommended_option_index;
            const selectedOption = item.options[selectedIndex] || item.options[0];
            return `### ${item.name}
- Current Price: ${item.current_price}
- Average Competitor Price: ${item.avg_competitor_price ?? "N/A"}
- Selected Option: ${selectedOption}
- All Options:
${item.options.map((opt, j) => `  ${j === selectedIndex ? "→" : " "} ${j + 1}. ${opt}`).join("\n")}`;
        })
        .join("\n\n");

    const userMessage = `
=======================================================
COMPANY NAME: ${input.companyName}
=======================================================

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
Generate the full RFP response document on behalf of "${input.companyName}".
Use the company name "${input.companyName}" throughout the document as the responding/proposing entity.
Use the user-selected options (or recommended where no selection was made) for pricing in the pricing table.
=======================================================`;

    const result = await agent.invoke({
        messages: [
            new SystemMessage(FINAL_DOCUMENT_PROMPT),
            new HumanMessage({ content: userMessage }),
        ],
    });

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
