import amqp from "amqplib";
import type { EmailEvent } from "common";
import { parseEmail } from "./agent/parser";

async function startConsumer() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "EMAIL";

  await channel.assertQueue(queue, {
    durable: true,
  });

  console.log("Waiting for Cloudflare emails on queue 'EMAIL'...");

  channel.consume(queue, async (msg) => {
    if (msg) {
      const content = msg.content.toString();
      try {
        const data = JSON.parse(content) as EmailEvent;
        channel.ack(msg);

        console.log("\n╔══════════════════════════════════════════════╗");
        console.log("║            📨  NEW EMAIL RECEIVED            ║");
        console.log("╠══════════════════════════════════════════════╣");
        console.log(`║  From:         ${data.from}`);
        console.log(`║  Attachments:  ${data.attachmentsUrl?.length ?? 0} file(s)`);
        data.attachmentsUrl?.forEach((url, i) => {
          const name = url.split("/").pop() ?? url;
          console.log(`║    ${i + 1}. ${name}`);
        });
        console.log(`║  Body preview: ${(data.text || data.html || "").slice(0, 80).replace(/\n/g, " ")}...`);
        console.log("╠══════════════════════════════════════════════╣");
        console.log("║  ⏳ Parsing with LLM...                      ║");
        console.log("╚══════════════════════════════════════════════╝\n");

        const result = await parseEmail(data);

        console.log("\n╔══════════════════════════════════════════════╗");
        console.log("║            ✅  PARSE RESULT                  ║");
        console.log("╠══════════════════════════════════════════════╣");
        console.log("║  Parsed Content:");
        console.log(result.structuredResponse.parsedContent);
        console.log("╠══════════════════════════════════════════════╣");
        console.log(`║  Missing Fields (${result.structuredResponse.missingFields.length}):`);
        result.structuredResponse.missingFields.forEach((f: string) => console.log(`║    ⚠  ${f}`));
        console.log("╚══════════════════════════════════════════════╝\n");
      } catch (e) {
        console.error("❌ Failed to process email:", e);
      }
    }
  });
}

startConsumer();