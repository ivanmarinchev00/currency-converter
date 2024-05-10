/* eslint-disable @typescript-eslint/no-explicit-any */
import { createCookieSessionStorage } from "@remix-run/node";

const sessionSecret = "your_super_secret_key";
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_currency_converter_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // one week
    httpOnly: true,
  },
});

export async function getSession(request: any) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function commitSession(session: any) {
  return sessionStorage.commitSession(session);
}

export async function destroySession(session: any) {
  return sessionStorage.destroySession(session);
}
