import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login and /admin/login/forgot-password)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = await auth();

    if (!session || !session.user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", encodeURIComponent(pathname));
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated user away from login page to /admin
  if (pathname === "/admin/login") {
    const session = await auth();
    if (session?.user) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
