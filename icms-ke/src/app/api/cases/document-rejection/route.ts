import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { buildCaseController } from "@/Infrastructure/bootstrap/buildCaseController";
import { buildSecurityContext } from "@/Presentation/Middleware/buildSecurityContext";
import { AuthorizationError, ValidationError } from "@/Domain/Exceptions/DomainError";

const bodySchema = z.object({
  individualId: z.string().min(1),
  assignedOfficerId: z.string().min(1),
  rejectionReason: z.string().trim().min(1),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const input = bodySchema.parse(body);

    const controller = buildCaseController();
    const context = buildSecurityContext(request.headers);
    const result = await controller.processDocumentRejection(input, context);

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

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      return NextResponse.json({ error: "Invalid individualId: individual does not exist" }, { status: 400 });
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
