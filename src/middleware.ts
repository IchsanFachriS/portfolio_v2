import { NextResponse, type NextRequest } from "next/server";

// admin.ichsanfachri.my.id  -> /admin/*
// ichsanfachri.my.id/admin  -> 404 (panel admin hanya lewat subdomain)
export function middleware(req: NextRequest) {
  const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").toLowerCase();
  const isAdminHost = host.startsWith("admin.");
  const url = req.nextUrl.clone();
  const { pathname } = url;

  if (isAdminHost) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return NextResponse.next();
    url.pathname = `/admin${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    url.pathname = "/404";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/(?!admin)|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
