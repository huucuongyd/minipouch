import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "nubena_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function credentials() {
  const account = process.env.admin_acc;
  const password = process.env.admin_pass;
  if (!account || !password) return null;
  return { account, password };
}

export function adminConfigured() {
  return credentials() !== null;
}

function digestEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

function sign(payload: string) {
  return createHmac("sha256", process.env.admin_pass ?? "").update(payload).digest("hex");
}

export async function createAdminSession() {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = Buffer.from(JSON.stringify({ exp: expires })).toString("base64url");
  const jar = await cookies();
  jar.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;
  const separator = token.lastIndexOf(".");
  if (separator <= 0) return false;
  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  return digestEqual(signature, sign(payload));
}

export function credentialsMatch(account: string, password: string) {
  const expected = credentials();
  if (!expected) return false;
  const accountOk = digestEqual(account, expected.account);
  const passwordOk = digestEqual(password, expected.password);
  return accountOk && passwordOk;
}
