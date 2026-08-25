import { createHash, randomBytes } from "node:crypto";

export function createOpaqueToken() {
  return randomBytes(32).toString("base64url");
}

export function hashOpaqueToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function minutesFromNow(minutes: number) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

export function daysFromNow(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}
