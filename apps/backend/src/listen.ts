import amqp from "amqplib";
import type { EmailEvent } from "common";
import { processEmail } from "./agent";

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
            const result = await processEmail(data);
            console.log("[done] parsed + inventory + competitor complete");
            console.log("[parsed]", result.parsed.parsedContent.slice(0, 200) + "...");
            console.log("[missing]", result.parsed.missingFields);

            console.log("[inventory]", result.inventory.messages);
            console.log("[competitor]", result.competitor);
        } catch (e) {
            console.error("[error]", e);
        }
    });
}

startConsumer();
