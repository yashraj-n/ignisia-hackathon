import crypto from "node:crypto";

function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(input: string): Buffer {
  const normalized = input.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(normalized.length + (4 - (normalized.length % 4)) % 4, "=");
  return Buffer.from(padded, "base64");
}

export function normalizePasswordSecret(stored: string): { salt: string; hash: string } {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) throw new Error("Invalid stored password format");
  return { salt, hash };
}

export function hashPassword(password: string): string {
  // PBKDF2 is built-in (no new deps). We store `saltBase64Url:hashBase64Url`.
  const salt = crypto.randomBytes(16);
  const iterations = 100_000;
  const keyLen = 32;

  const hash = crypto
    .pbkdf2Sync(password, salt, iterations, keyLen, "sha256")
    .toString("base64");

  return `${base64UrlEncode(salt)}:${hash.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const { salt, hash } = normalizePasswordSecret(stored);
  const saltBuf = base64UrlDecode(salt);

  const iterations = 100_000;
  const keyLen = 32;
  const derivedHash = crypto
    .pbkdf2Sync(password, saltBuf, iterations, keyLen, "sha256")
    .toString("base64");
  const derivedHashNorm = derivedHash.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");

  // Constant-time compare avoids leaking which portion matched.
  const a = Buffer.from(derivedHashNorm, "utf8");
  const b = Buffer.from(hash, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function generateVerificationToken(bytes = 32): string {
  return base64UrlEncode(crypto.randomBytes(bytes));
}

type JwtPayload = Record<string, unknown> & {
  companyId: string;
  email: string;
  iat: number;
  exp: number;
};

export function signJwt(payload: Omit<JwtPayload, "iat" | "exp">, opts?: { ttlSeconds?: number }): string {
  const secret = process.env.AUTH_TOKEN_SECRET;
  if (!secret) throw new Error("AUTH_TOKEN_SECRET is missing");

  const ttlSeconds = opts?.ttlSeconds ?? 60 * 60 * 24 * 7; // 7 days
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + ttlSeconds;

  const fullPayload = {
    ...payload,
    iat,
    exp,
  } as JwtPayload;

  const header = { alg: "HS256", typ: "JWT" };
  const encHeader = base64UrlEncode(Buffer.from(JSON.stringify(header)));
  const encPayload = base64UrlEncode(Buffer.from(JSON.stringify(fullPayload)));

  const signingInput = `${encHeader}.${encPayload}`;
  const sig = crypto
    .createHmac("sha256", secret)
    .update(signingInput)
    .digest();
  const encSig = base64UrlEncode(sig);
  return `${signingInput}.${encSig}`;
}

