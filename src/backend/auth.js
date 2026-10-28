
import crypto from "node:crypto";

const COOKIE_NAME = "minicom_session";
const SESSION_DURATION = 8 * 60 * 60; // 8 hours

export { COOKIE_NAME, SESSION_DURATION };

function safeEqual(valueA, valueB) {
  const a = crypto.createHash("sha256").update(String(valueA)).digest();
  const b = crypto.createHash("sha256").update(String(valueB)).digest();

  return crypto.timingSafeEqual(a, b);
}

export function verifyCredentials(role, username, password) {
  const isAdmin = role === "admin";

  if (role !== "admin" && role !== "customer") {
    return false;
  }

  const expectedUsername = isAdmin
    ? process.env.ADMIN_USERNAME
    : process.env.CUSTOMER_USERNAME;

  const expectedPassword = isAdmin
    ? process.env.ADMIN_PASSWORD
    : process.env.CUSTOMER_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    throw new Error(`Missing environment credentials for ${role}.`);
  }

  return (
    safeEqual(username, expectedUsername) &&
    safeEqual(password, expectedPassword)
  );
}

function getSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters.");
  }

  return secret;
}

function sign(value) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(value)
    .digest("base64url");
}

export function createSessionToken(role, username) {
  const payload = Buffer.from(
    JSON.stringify({
      role,
      username,
      exp: Math.floor(Date.now() / 1000) + SESSION_DURATION,
    })
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  try {
    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payload, signature] = parts;
    if (!safeEqual(signature, sign(payload))) return null;

    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    if (
      !["admin", "customer"].includes(session.role) ||
      typeof session.username !== "string" ||
      !Number.isFinite(session.exp) ||
      session.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return {
      role: session.role,
      username: session.username,
    };
  } catch {
    return null;
  }
}
