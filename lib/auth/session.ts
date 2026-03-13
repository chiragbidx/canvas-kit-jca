import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "panda_auth_session";

const maxAgeSeconds = 60 * 60 * 24 * 7;

export async function createAuthSession(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export async function clearAuthSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function getAuthSessionEmail() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}
