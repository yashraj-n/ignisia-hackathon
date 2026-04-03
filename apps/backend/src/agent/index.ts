import type { EmailEvent } from "common";
import { parseEmail, type RFPParserResponse } from "./parser";
import { generateInventoryStats } from "./inventory";
import { generateCompetitorPricing } from "./competitor";
import { generateSummary } from "./summariser";
import { db } from "../db";

export async function processEmail(email: EmailEvent) {
    const parseResult = await parseEmail(email);
    const parsed: RFPParserResponse = parseResult.structuredResponse;

    const company = await db.company.findUnique({
        where: { login_email: email.from }
    });

    if (!company) {
        throw new Error(`No company found for email: ${email.from}`);
    }

    const [inventoryResult, competitorResult] = await Promise.all([
        generateInventoryStats(parsed, company.id),
        generateCompetitorPricing(parsed, company.id),
    ]);

    // Consolidate all data through the summariser agent
    const summary = await generateSummary({
        parsed,
        inventoryResult,
        competitorResult,
        companyId: company.id,
    });

    return {
        parsed,
        inventory: inventoryResult,
        competitor: competitorResult,
        summary,
    };
}
