import { NextRequest, NextResponse } from "next/server";
import { buildSecurityContext } from "@/Presentation/Middleware/buildSecurityContext";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};

export async function middleware(request: NextRequest): Promise<NextResponse | void> {
  // Public routes that don't require authentication
  const publicRoutes = ["/welcome", "/"];

  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return undefined;
  }

  // For protected routes, extract and validate security context
  const context = buildSecurityContext(request.headers);

  if (!context.actorId) {
    return NextResponse.json(
      { error: "Unauthorized: Missing actor identity" },
      { status: 401 }
    );
  }

  // Log the access attempt (audit trail)
  console.log("MIDDLEWARE_ACCESS", {
    actorId: context.actorId,
    role: context.role,
    jurisdiction: context.jurisdiction,
    pathname: request.nextUrl.pathname,
    timestamp: new Date().toISOString(),
  });

  return undefined;
}
