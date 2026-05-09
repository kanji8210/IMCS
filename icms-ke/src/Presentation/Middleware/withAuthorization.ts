import { NextRequest, NextResponse } from "next/server";
import { buildSecurityContext } from "@/Presentation/Middleware/buildSecurityContext";
import { SecurityContext } from "@/Domain/Services/Ports";
import { RolePolicyService } from "@/Infrastructure/Auth/RolePolicyService";

/**
 * Protected API middleware that enforces authorization on all /api/cases/* routes.
 * This runs after the main middleware auth check and validates role-based access.
 */
export async function withAuthorization(
  request: NextRequest,
  handler: (req: NextRequest, context: SecurityContext) => Promise<NextResponse>
): Promise<NextResponse> {
  const context = buildSecurityContext(request.headers);
  const policyService = new RolePolicyService();

  // Determine the action from the route
  const pathname = request.nextUrl.pathname;
  let action = "unknown";

  if (pathname.includes("flag-expiring-eta")) action = "flagExpiringEta";
  else if (pathname.includes("document-rejection")) action = "processDocumentRejection";
  else if (pathname.includes("recommendations")) action = "submitRecommendation";

  // Enforce policy
  const allowed = policyService.canExecute(action, context);
  if (!allowed) {
    return NextResponse.json(
      { error: `Authorization denied for action: ${action}` },
      { status: 403 }
    );
  }

  // Proceed to handler
  return handler(request, context);
}
