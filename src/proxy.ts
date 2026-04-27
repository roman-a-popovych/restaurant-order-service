import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin/orders");

  if (!isAdminPage) {
    return NextResponse.next();
  }

  const isAuth = request.cookies.get("admin_auth")?.value === "true";

  if (!isAuth) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/orders/:path*"],
};