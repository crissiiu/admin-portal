import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/profile") || request.nextUrl.pathname.startsWith("/applications");
  const hasSession = Boolean(request.cookies.get("job_portal_session"));

  if (isDashboardRoute && !hasSession) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/applications/:path*"]
};

