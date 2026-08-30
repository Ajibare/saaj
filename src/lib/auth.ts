import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "saaj_admin_session";
export const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

export type AdminSession = {
  sub: string;
  name: string;
  email: string;
  role: string;
};

function sessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET ?? "dev-only-insecure-secret";
  return new TextEncoder().encode(secret);
}

export async function signSession(session: AdminSession): Promise<string> {
  return new SignJWT({
    name: session.name,
    email: session.email,
    role: session.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(sessionSecret());
}

export async function verifySession(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, sessionSecret());
    if (typeof payload.sub !== "string" || payload.sub.length === 0) return null;
    return {
      sub: payload.sub,
      name: typeof payload.name === "string" ? payload.name : "",
      email: typeof payload.email === "string" ? payload.email : "",
      role: typeof payload.role === "string" ? payload.role : "admin",
    };
  } catch {
    return null;
  }
}