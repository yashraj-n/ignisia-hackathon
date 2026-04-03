import type { EmailEvent } from "common";
import { parseEmail, type RFPParserResponse } from "./parser";
import { generateInventoryStats } from "./inventory";
import { generateCompetitorPricing } from "./competitor";
import { generateSummary, extractTextFromResult, type SummariserResponse } from "./summariser";

/**
 * Step 1 — Parse: runs the parser agent on an incoming email.
 * Returns the structured RFPParserResponse.
 */
export async function runParseStep(email: EmailEvent): Promise<RFPParserResponse> {
    const parseResult = await parseEmail(email);
    return parseResult.structuredResponse as RFPParserResponse;
}

/**
 * Step 2 — Explore: runs inventory + competitor agents in parallel.
 * Returns a combined markdown string with both sections.
 */
export async function runExploreStep(parsed: RFPParserResponse, companyId: string): Promise<string> {
    const [inventoryResult, competitorResult] = await Promise.all([
        generateInventoryStats(parsed, companyId),
        generateCompetitorPricing(parsed, companyId),
    ]);

    const inventoryText = extractTextFromResult(inventoryResult);
    const competitorText = extractTextFromResult(competitorResult);

    return `## Inventory Analysis\n\n${inventoryText}\n\n---\n\n## Competitor Pricing\n\n${competitorText}`;
}

/**
 * Step 3 — Summarise: runs the summariser agent using parsed + explore outputs.
 * Returns the structured SummariserResponse.
 */
export async function runSummariseStep(
    parsed: RFPParserResponse,
    exploreMarkdown: string,
    companyId: string,
): Promise<SummariserResponse> {
    // Split the explore markdown back into inventory and competitor sections
    const separator = "\n\n---\n\n## Competitor Pricing\n\n";
    const separatorIndex = exploreMarkdown.indexOf(separator);

    let inventoryText: string;
    let competitorText: string;

    if (separatorIndex !== -1) {
        inventoryText = exploreMarkdown.slice("## Inventory Analysis\n\n".length, separatorIndex);
        competitorText = exploreMarkdown.slice(separatorIndex + separator.length);
    } else {
        // Fallback: pass entire markdown as both
        inventoryText = exploreMarkdown;
        competitorText = exploreMarkdown;
    }

    const summary = await generateSummary({
        parsed,
        inventoryText,
        competitorText,
        companyId,
    });

    return summary.structuredResponse as SummariserResponse;
}
