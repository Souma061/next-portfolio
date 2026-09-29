import { createHmac, createHash, timingSafeEqual } from "node:crypto";

export const COOKIE = "write_session";
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const secret = () => process.env.SESSION_SECRET ?? "";

export function issueToken(ttlSeconds = MAX_AGE_SECONDS): string {
  const exp = Date.now() + ttlSeconds * 1000;
  const sig = createHmac("sha256", secret()).update(String(exp)).digest("base64url");
  return `${exp}.${sig}`;
}

export function verifyToken(token?: string): boolean {
  if (!token || !secret()) return false;
  const dot = token.indexOf(".");
  if (dot < 1) return false;

  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^\d{13}$/.test(exp) || Number(exp) < Date.now()) return false;

  const expected = createHmac("sha256", secret()).update(exp).digest();
  let got: Buffer;
  try {
    got = Buffer.from(sig, "base64url");
  } catch {
    return false;
  }
  return got.length === expected.length && timingSafeEqual(got, expected);
}

export function passwordMatches(input: string): boolean {
  const expected = process.env.WRITE_PASSWORD ?? "";
  if (!expected) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}
