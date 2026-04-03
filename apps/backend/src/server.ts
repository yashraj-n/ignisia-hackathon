import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import { logger } from "./utils/logger";
import { db } from "./db";
import { loginCompany, signupCompany, verifyCompany } from "./auth/companyAuth";
import z from "zod";

const fastify = Fastify({
  loggerInstance: logger,
});

fastify.register(cors);
fastify.register(sensible);

const signupSchema = z.object({
  name: z.string().min(1),
  login_email: z.string().email(),
  login_password: z.string().min(8),
  size: z.number().int().positive(),
});

fastify.post("/api/signup", async (request, reply) => {
  try {
    const input = signupSchema.parse(request.body);
    const result = await signupCompany(input, { db });
    return result;
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw fastify.httpErrors.badRequest(err.issues.map((e) => e.message).join(", "));
    }
    const message = err instanceof Error ? err.message : String(err);
    if (message === "COMPANY_EXISTS") {
      throw fastify.httpErrors.conflict("Company with this login email already exists");
    }
    throw err;
  }
});

const verifySchema = z.object({
  token: z.string().min(1),
});

fastify.get("/api/verify", async (request, reply) => {
  try {
    const input = verifySchema.parse(request.query);
    const result = await verifyCompany(input.token, { db });
    return result;
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw fastify.httpErrors.badRequest("Invalid verification token");
    }
    const message = err instanceof Error ? err.message : String(err);
    if (message === "INVALID_TOKEN") {
      throw fastify.httpErrors.badRequest("Invalid verification token");
    } else if (message === "TOKEN_EXPIRED") {
      throw fastify.httpErrors.badRequest("Verification token expired");
    }
    throw err;
  }
});

const loginSchema = z.object({
  login_email: z.string().email(),
  login_password: z.string().min(1),
});

fastify.post("/api/login", async (request, reply) => {
  try {
    const input = loginSchema.parse(request.body);
    const result = await loginCompany(input, { db });
    return result;
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw fastify.httpErrors.badRequest("Invalid input");
    }
    const message = err instanceof Error ? err.message : String(err);
    if (message === "INVALID_CREDENTIALS") {
      throw fastify.httpErrors.unauthorized("Invalid credentials");
    } else if (message === "NOT_VERIFIED") {
      throw fastify.httpErrors.forbidden("Email not verified");
    }
    throw err;
  }
});

fastify.get("/api/test", async (request, reply) => {
  logger.info("Test");
  const testSchema = z.object({
    name: z.string(),
    age: z.coerce.number(),
  });
  const input = testSchema.parse(request.query);
  return {
    name: input.name,
    age: input.age,
  };
});

fastify.get("/api/nonTest", async (request, reply) => {
  logger.info("Non Test");
  return {
    message: "Non Test",
  };
});

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
