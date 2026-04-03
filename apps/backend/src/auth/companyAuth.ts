import type { PrismaClient } from "../../generated/prisma/client.ts";
import { hashPassword, signJwt, verifyPassword, generateVerificationToken } from "./crypto";
import { sendVerificationEmail } from "./resend";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export type SignupCompanyInput = {
  name: string;
  login_email: string;
  login_password: string;
  size: number;
};

export type LoginCompanyInput = {
  login_email: string;
  login_password: string;
};

function getVerificationTtlMinutes(): number {
  const raw = process.env.VERIFICATION_TOKEN_TTL_MINUTES;
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) ? parsed : 60;
}

function getPublicBackendUrl(override?: string): string {
  return override ?? process.env.PUBLIC_BACKEND_URL ?? "http://localhost:9000";
}

export async function signupCompany(
  input: SignupCompanyInput,
  deps: { db: PrismaClient; publicBackendUrl?: string },
): Promise<{ companyId: string }> {
  const loginEmail = normalizeEmail(input.login_email);

  const existing = await deps.db.company.findUnique({
    where: { login_email: loginEmail },
    select: { id: true },
  });
  if (existing) throw new Error("COMPANY_EXISTS");

  const passwordHash = hashPassword(input.login_password);

  const token = generateVerificationToken(32);
  const expiresAt = new Date(Date.now() + getVerificationTtlMinutes() * 60_000);

  const company = await deps.db.company.create({
    data: {
      name: input.name,
      login_email: loginEmail,
      login_password: passwordHash,
      size: input.size,
      is_verified: false,
      verification_token: token,
      verification_token_expires_at: expiresAt,
    },
    select: { id: true },
  });

  const publicBackendUrl = getPublicBackendUrl(deps.publicBackendUrl);
  const verificationUrl = `${publicBackendUrl}/api/verify?token=${encodeURIComponent(token)}`;

  await sendVerificationEmail({
    to: loginEmail,
    verificationUrl,
  });

  return { companyId: company.id };
}

export async function verifyCompany(
  token: string,
  deps: { db: PrismaClient },
): Promise<{ ok: true }> {
  const company = await deps.db.company.findFirst({
    where: { verification_token: token },
    select: {
      id: true,
      verification_token_expires_at: true,
      is_verified: true,
    },
  });

  if (!company) throw new Error("INVALID_TOKEN");
  if (company.is_verified) return { ok: true }; // Idempotent: already verified.
  if (!company.verification_token_expires_at) throw new Error("INVALID_TOKEN");

  if (company.verification_token_expires_at.getTime() < Date.now()) {
    throw new Error("TOKEN_EXPIRED");
  }

  await deps.db.company.update({
    where: { id: company.id },
    data: {
      is_verified: true,
      verification_token: null,
      verification_token_expires_at: null,
    },
  });

  return { ok: true };
}

export async function loginCompany(
  input: LoginCompanyInput,
  deps: { db: PrismaClient },
): Promise<{ token: string; company: { id: string; name: string; size: number; login_email: string } }> {
  const loginEmail = normalizeEmail(input.login_email);

  const company = await deps.db.company.findUnique({
    where: { login_email: loginEmail },
  });

  if (!company) throw new Error("INVALID_CREDENTIALS");
  if (!verifyPassword(input.login_password, company.login_password)) {
    throw new Error("INVALID_CREDENTIALS");
  }
  if (!company.is_verified) throw new Error("NOT_VERIFIED");

  const token = signJwt({ companyId: company.id, email: company.login_email });

  return {
    token,
    company: {
      id: company.id,
      name: company.name,
      size: company.size,
      login_email: company.login_email,
    },
  };
}

