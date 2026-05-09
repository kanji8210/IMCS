import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { buildCaseController } from "@/Infrastructure/bootstrap/buildCaseController";
import { buildSecurityContext } from "@/Presentation/Middleware/buildSecurityContext";
import { AuthorizationError, ValidationError } from "@/Domain/Exceptions/DomainError";

const bodySchema = z.object({
  windowDays: z.number().int().min(1).max(365),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const input = bodySchema.parse(body);

    const controller = buildCaseController();
    const context = buildSecurityContext(request.headers);
    const result = await controller.flagExpiringETA(input.windowDays, context);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request payload", details: error.issues }, { status: 400 });
    }

    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
