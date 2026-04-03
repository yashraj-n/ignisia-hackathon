import "dotenv/config";
import "./listen";
import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import { logger } from "./utils/logger";
import { signupRoute } from "./routes/auth/signup";
import { verifyRoute } from "./routes/auth/verify";
import { loginRoute } from "./routes/auth/login";
import { meRoute } from "./routes/auth/me";
import { testRoute } from "./routes/test/test";
import { nonTestRoute } from "./routes/test/nonTest";
import { addCompetitorRoute } from "./routes/company/add-competitor";
import { addInventoryRoute } from "./routes/company/add-inventory";
import { listInventoryRoute } from "./routes/company/list-inventory";
import { listCompetitorsRoute } from "./routes/company/list-competitors";
import { uploadRfpRoute } from "./routes/rfp/upload-rfp";
import { searchRfpRoute } from "./routes/rfp/search-rfp";

const fastify = Fastify({
  loggerInstance: logger,
});

fastify.register(cors);
fastify.register(sensible);
fastify.register(signupRoute);
fastify.register(verifyRoute);
fastify.register(loginRoute);
fastify.register(meRoute);
fastify.register(testRoute);
fastify.register(nonTestRoute);
fastify.register(addCompetitorRoute);
fastify.register(addInventoryRoute);
fastify.register(listInventoryRoute);
fastify.register(listCompetitorsRoute);
fastify.register(uploadRfpRoute);
fastify.register(searchRfpRoute);

const start = async () => {
  try {
    await fastify.listen({ port: 9000, host: "::" });
    console.log(`Server listening at http://localhost:9000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
