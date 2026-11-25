import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createHmac, randomBytes } from "node:crypto";
import { execute, insert, queryOne } from "./db";
import { verifyPassword } from "./password";
import type { Author } from "./types";

export const SESSION_COOKIE = "pv_session";
export const THEME_COOKIE = "pv_theme";
const SESSION_DAYS = 7;

type LoginUser = Author & { password_hash: string };

const attempts = new Map<string, { count: number; resetAt: number }>();

export function loginRateLimitKey(email: string, ip: string) {
  return `${email.toLowerCase()}::${ip}`;
}

export function isRateLimited(key: string) {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (Date.now() > entry.resetAt) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= 6;
}

export function registerLoginFailure(key: string) {
  const entry = attempts.get(key);
  if (!entry || Date.now() > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: Date.now() + 15 * 60 * 1000 });
    return;
  }
  entry.count += 1;
}

export function clearLoginFailures(key: string) {
  attempts.delete(key);
}

function hashToken(token: string) {
  return createHmac("sha256", process.env.SESSION_SECRET || "palavra-viva-dev-secret").update(token).digest("hex");
}

export async function getClientIp() {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headerStore.get("x-real-ip") || "local";
}

export async function getUserAgent() {
  const headerStore = await headers();
  return (headerStore.get("user-agent") || "desconhecido").slice(0, 250);
}

function emailVariants(email: string) {
  const variants = new Set([email]);
  const [local, domain] = email.split("@");
  if (domain && local) {
    // Tolerância a erro de digitação no início do e-mail do administrador:
    // "rinaldo..." e "rrinaldo..." apontam para a mesma conta.
    if (local.startsWith("rr")) variants.add(`${local.slice(1)}@${domain}`);
    else variants.add(`r${local}@${domain}`);
  }
  return [...variants];
}

export async function authenticate(email: string, password: string): Promise<Author | null> {
  const normalized = email.trim().toLowerCase();
  let user: LoginUser | null = null;

  for (const candidate of emailVariants(normalized)) {
    user = await queryOne<LoginUser>("SELECT * FROM users WHERE email = ? COLLATE NOCASE LIMIT 1", [candidate]);
    if (user) break;
  }

  if (!user) return null;
  if (!verifyPassword(password, user.password_hash)) return null;
  const { password_hash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  const ip = await getClientIp();
  const userAgent = await getUserAgent();

  await execute("DELETE FROM sessions WHERE datetime(expires_at) <= datetime('now')");
  await insert(
    "INSERT INTO sessions (id, user_id, expires_at, ip, user_agent) VALUES (?, ?, ?, ?, ?)",
    [hashToken(token), userId, expires.toISOString(), ip, userAgent],
  );

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: (process.env.SITE_URL || "").startsWith("https://"),
    path: "/",
    expires,
  });
  await execute("UPDATE users SET last_login_at = datetime('now') WHERE id = ?", [userId]);
}

export async function revokeOtherSessions(userId: number) {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return;
  await execute("DELETE FROM sessions WHERE user_id = ? AND id <> ?", [userId, hashToken(token)]);
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await execute("DELETE FROM sessions WHERE id = ?", [hashToken(token)]);
  }
  store.delete(SESSION_COOKIE);
}

export const getCurrentUser = cache(async (): Promise<Author | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await queryOne<Author & { expires_at: string }>(
    `SELECT u.id, u.name, u.email, u.bio, u.avatar, u.role, u.created_at, u.last_login_at, s.expires_at
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.id = ? LIMIT 1`,
    [hashToken(token)],
  );
  if (!session) return null;

  if (new Date(session.expires_at).getTime() < Date.now()) {
    await execute("DELETE FROM sessions WHERE id = ?", [hashToken(token)]);
    return null;
  }

  const { expires_at: _expiresAt, ...user } = session;
  return user;
});

export async function requireAdmin(): Promise<Author> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function getThemeCookie() {
  const store = await cookies();
  return store.get(THEME_COOKIE)?.value || "";
}
