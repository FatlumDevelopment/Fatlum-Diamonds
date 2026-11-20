import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_FILES = ["/sitemap.xml", "/robots.txt", "/opengraph-image", "/icon", "/apple-icon", "/favicon.ico"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    PUBLIC_FILES.some((file) => pathname === file || pathname.startsWith(`${file}/`)) ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }
  if (pathname === "/") return NextResponse.redirect(new URL("/de", req.url));
  const first = pathname.split("/")[1];
  if (first !== "de" && first !== "en") return NextResponse.redirect(new URL(`/de${pathname}`, req.url));
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-locale", first);
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("x-locale", first);
  return res;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
