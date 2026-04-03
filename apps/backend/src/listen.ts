import amqp from "amqplib";
import type { EmailEvent } from "common";
import { runParseStep } from "./agent";
import { db } from "./db";
import { generateEmbedding } from "./utils/embedding";

async function startConsumer() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue("EMAIL", { durable: true });
    console.log("[consumer] Waiting for emails on queue 'EMAIL'...");

    channel.consume("EMAIL", async (msg) => {
        if (!msg) return;

        const data = JSON.parse(msg.content.toString()) as EmailEvent;
        channel.ack(msg);

        console.log(`[email] from=${data.from} attachments=${data.attachmentsUrl?.length ?? 0}`);

        try {
            // Look up the company by sender email
            const company = await db.company.findUnique({
                where: { login_email: data.from },
            });

            if (!company) {
                console.warn(`[consumer] No company found for email: ${data.from} — discarding.`);
                return;
            }

            // Step 1: Parse the email
            console.log(`[consumer] Running parse step for company ${company.id}...`);
            const parsed = await runParseStep(data);

            // Generate embedding from parsedContent
            const embedding = await generateEmbedding(parsed.parsedContent);

            // Create RFP record with parsed output
            const rfp = await db.rFP.create({
                data: {
                    company_id: company.id,
                    source_email: data.from,
                    status: "parsed",
                    parsed_output: parsed as any,
                    information: parsed.parsedContent,
                    embedding,
                },
            });

            console.log(`[consumer] ✅ RFP created: ${rfp.id} (status: parsed)`);
        } catch (e) {
            console.error("[consumer] Error processing email:", e);
        }
    });
}

startConsumer();
