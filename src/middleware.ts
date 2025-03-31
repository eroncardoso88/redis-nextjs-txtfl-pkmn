import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { CUSTOM_SESSION_COOKIE_NAME } from "./lib/config";

export const runtime = "experimental-edge";

const publicPaths = [
  "/sign-in",
  "/sign-up",
  "/api/auth",
  "/api/auth/session-check",
  "/forgot-password",
  "/reset-password",
];

const isPublicPath = (path: string) =>
  publicPaths.some((p) => path.startsWith(p));

const isStaticFile = (path: string) =>
  path.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/i);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticFile(pathname) || isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const sessionId = request.cookies.get(CUSTOM_SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/sign-in";
    redirectUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const origin = request.nextUrl.origin;
    const response = await fetch(
      `${origin}/api/auth/session-check?sessionId=${encodeURIComponent(
        sessionId
      )}`,
      { method: "GET" }
    );

    const data = await response.json();

    if (!data.valid) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/sign-in";
      redirectUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error checking session:", error);

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/sign-in";
    redirectUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
