import "server-only";
import { cookies } from "next/headers";
import { db } from "./db";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createHmac, randomBytes } from "crypto";

const SESSION_COOKIE_NAME = "eduplan_session";
const SECRET = process.env.BETTER_AUTH_SECRET || "dev-secret-change-in-production";

function sign(payload: Record<string, unknown>, secret: string): string {
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const timestamp = Date.now();
  const signature = createHmac("sha256", secret)
    .update(`${base64Payload}.${timestamp}`)
    .digest("base64url");
  return `${base64Payload}.${timestamp}.${signature}`;
}

function verify(token: string, secret: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [base64Payload, timestampStr, signature] = parts;
  const expectedSignature = createHmac("sha256", secret)
    .update(`${base64Payload}.${timestampStr}`)
    .digest("base64url");
  if (signature !== expectedSignature) return null;
  const timestamp = Number(timestampStr);
  if (Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) return null;
  try {
    return JSON.parse(Buffer.from(base64Payload, "base64url").toString()) as {
      userId: string;
      email: string;
    };
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verify(token, SECRET);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("未登录");
  }
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, session.email))
    .limit(1);
  if (user.length === 0) throw new Error("用户不存在");
  return user[0];
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
