import amqp from "amqplib";

async function startConsumer() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "EMAIL";

  await channel.assertQueue(queue, {
    durable: true,
  });

  console.log("👂 Waiting for Cloudflare emails on queue 'EMAIL'...");

  channel.consume(queue, (msg) => {
    if (msg) {
      const content = msg.content.toString();
      
      try {
        const data = JSON.parse(content);
        console.log(`\n📩 New Email received from [${data.from}]:\nSnippet: ${data.text?.substring(0, 50) ?? "No text..."}`);
      } catch(e) {
        console.log("📩 Received Raw payload:", content);
      }

      // IMPORTANT: acknowledge message
      channel.ack(msg);
    }
  });
}

startConsumer();