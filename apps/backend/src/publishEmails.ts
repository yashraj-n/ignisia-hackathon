import amqp from "amqplib";
import { db } from "./db";

async function pushEmailsToQueue() {
  try {
    // 1. Fetch all companies from the Prisma database
    const companies = await db.company.findMany({
      select: {
        login_email: true,
      },
    });

    if (companies.length === 0) {
      console.log("No companies found in the database.");
      return;
    }

  // Use remote URI from .env or default to localhost
  const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "emails";
    await channel.assertQueue(queue, {
      durable: true,
    });

    console.log(`Starting to push ${companies.length} emails to the queue...`);

    // 3. Loop through company emails and send them to the Queue
    for (const company of companies) {
      const message = JSON.stringify({ email: company.login_email });
      
      const sent = channel.sendToQueue(queue, Buffer.from(message), {
        persistent: true, // Persists message safely
      });

      if (sent) {
        console.log(`✅ Pushed to queue: ${company.login_email}`);
      }
    }

    // 4. Close connections cleanly
    await channel.close();
    await connection.close();
    console.log("🎉 All emails pushed to the queue successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error pushing emails to queue:", error);
    process.exit(1);
  }
}

pushEmailsToQueue();
