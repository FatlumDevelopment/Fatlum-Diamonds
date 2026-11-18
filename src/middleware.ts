import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.includes(".")) return NextResponse.next();
  if (pathname === "/") return NextResponse.redirect(new URL("/de", req.url));
  const first = pathname.split("/")[1];
  if (first !== "de" && first !== "en") return NextResponse.redirect(new URL(`/de${pathname}`, req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
