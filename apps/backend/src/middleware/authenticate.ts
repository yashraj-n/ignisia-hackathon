import type { FastifyRequest, FastifyReply } from "fastify";
import { verifyJwt } from "../auth/crypto";

declare module "fastify" {
  interface FastifyRequest {
    companyId: string;
    companyEmail: string;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw reply.unauthorized("Missing or invalid Authorization header");
  }

  const token = header.slice(7);
  try {
    const payload = verifyJwt(token);
    request.companyId = payload.companyId;
    request.companyEmail = payload.email;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message === "TOKEN_EXPIRED") {
      throw reply.unauthorized("Token expired");
    }
    throw reply.unauthorized("Invalid token");
  }
}
