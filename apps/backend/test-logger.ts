import Fastify from "fastify";
import pino from "pino";

const logger = pino();
try {
  const fastify = Fastify({ loggerInstance: logger });
  console.log("Success with loggerInstance");
} catch(e) {
  console.log("Failed with loggerInstance:", e.message);
}

try {
  const fastify = Fastify({ logger: logger });
  console.log("Success with logger");
} catch(e) {
  console.log("Failed with logger:", e.message);
}
