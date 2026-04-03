import { RPCHandler } from "@orpc/server/fetch";
import { CORSPlugin } from "@orpc/server/plugins";
import { onError } from "@orpc/server";
import { router } from "./orpc";
import { LoggingHandlerPlugin } from "@orpc/experimental-pino";
import { logger } from "./utils/logger";
import { db } from "./db";

const handler = new RPCHandler(router, {
  plugins: [
    new CORSPlugin(),
    new LoggingHandlerPlugin({
      logger,
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

Bun.serve({
  async fetch(request: Request) {
    const { matched, response } = await handler.handle(request, {
      prefix: "/rpc",
      context: {
        logger,
        db,
      },
    });

    if (matched) {
      return response;
    }

    return new Response("Not found", { status: 404 });
  },
  port: 9000,
  error(error) {
    console.error(error);
  },
});
