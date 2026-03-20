import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "serbisyo360-secret-key-change-in-production";
const COOKIE_NAME = "s360_session";

// ─── Password hashing (PBKDF2) ─────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.pbkdf2(password, salt, 100000, 64, "sha256", (err, key) => {
      if (err) reject(err);
      else resolve(`${salt}:${key.toString("hex")}`);
    });
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, storedKey] = hash.split(":");
    if (!salt || !storedKey) { resolve(false); return; }
    crypto.pbkdf2(password, salt, 100000, 64, "sha256", (err, key) => {
      if (err) reject(err);
      else resolve(key.toString("hex") === storedKey);
    });
  });
}

// ─── Phone hashing (for dedup, privacy) ────────────────────────────────────
export function hashPhone(phone: string): string {
  return crypto.createHash("sha256").update(phone.replace(/\s/g, "")).digest("hex");
}

export function maskPhone(phone: string): string {
  const clean = phone.replace(/\s/g, "");
  const match = clean.match(/^(\+63|0)(\d{3})(\d{3,4})(\d{3,4})$/);
  if (!match) return phone.slice(0, 4) + "****" + phone.slice(-3);
  return `${match[1]} ${match[2]} **** ${match[4]}`;
}

// ─── Simple JWT (HMAC-SHA256) ───────────────────────────────────────────────
function b64url(buf: Buffer | string): string {
  const s = typeof buf === "string" ? buf : buf.toString("base64");
  return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function signJWT(payload: Record<string, unknown>, expiresInHours = 24): string {
  const header = b64url(Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64"));
  const body = b64url(Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + expiresInHours * 3600, iat: Math.floor(Date.now() / 1000) })).toString("base64"));
  const sig = b64url(crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64"));
  return `${header}.${body}.${sig}`;
}

export function verifyJWT(token: string): Record<string, unknown> | null {
  try {
    const [header, body, sig] = token.split(".");
    const expectedSig = b64url(crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64"));
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// ─── Session helpers ────────────────────────────────────────────────────────
export function getSession(req: NextRequest): Record<string, unknown> | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyJWT(token);
}

export function setSessionCookie(res: NextResponse, payload: Record<string, unknown>) {
  const token = signJWT(payload);
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
}

// ─── Auth guard helper ──────────────────────────────────────────────────────
export function requireAuth(
  req: NextRequest,
  role?: "lgu_admin" | "worker"
): { session: Record<string, unknown> } | NextResponse {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (role && session.role !== role) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return { session };
}

// ─── OTP generation ─────────────────────────────────────────────────────────
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
