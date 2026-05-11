import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ReportViolationCommand } from "@/Application/UseCases/ReportViolationUseCase";
import { buildViolationController } from "@/Infrastructure/bootstrap/buildViolationController";
import { ViolationType } from "@/Domain/ValueObjects/ViolationType";
import { ViolationSeverity } from "@/Domain/Entities/Violation";
import { buildSecurityContext } from "@/Presentation/Middleware/buildSecurityContext";

/**
 * Validation schema for report violation request
 */
const SubjectSchema = z.object({
  fullName: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  passportNumber: z.string().optional().nullable(),
  contactPerson: z.string().optional().nullable(),
  organisationName: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  directorName: z.string().optional().nullable(),
}).optional().nullable();

const ReporterSchema = z.object({
  reporterCategory: z.enum(["public", "law_enforcement"]).optional().nullable(),
  fullName: z.string().optional().nullable(),
  phoneOrEmail: z.string().optional().nullable(),
  relationship: z.string().optional().nullable(),
  officerAgencyType: z.enum(["police", "immigration", "state_officer_other"]).optional().nullable(),
  officerRankOrTitle: z.string().optional().nullable(),
  officerServiceNumber: z.string().optional().nullable(),
  officerStationOrUnit: z.string().optional().nullable(),
  contactEstablishedWithSubject: z.enum(["yes", "no"]).optional().nullable(),
  contactEstablishedAt: z.string().optional().nullable(),
  otherInstitutionHasReport: z.boolean().optional(),
  otherInstitutionName: z.string().optional().nullable(),
  otherInstitutionReference: z.string().optional().nullable(),
  custodyStatus: z.enum(["not_in_custody", "arrested", "detained"]).optional().nullable(),
  custodySince: z.string().optional().nullable(),
  assistanceNeeded: z.string().optional().nullable(),
  whistleblowerProtection: z.boolean().optional(),
}).optional().nullable();

const ReportViolationSchema = z.object({
  individualId: z.string().optional().nullable(),
  subjectType: z.enum(["individual", "organisation"]).optional().nullable(),
  subject: SubjectSchema,
  reporter: ReporterSchema,
  violationType: z.enum([
    // Temporal
    ViolationType.ETA_OVERSTAY,
    ViolationType.EXPIRED_PERMIT,
    ViolationType.BREACH_OF_CONDITIONS,
    // Integrity
    ViolationType.DOCUMENT_FORGERY,
    ViolationType.MATERIAL_MISREPRESENTATION,
    ViolationType.FAILURE_TO_NOTIFY,
    // Regulatory
    ViolationType.FAILURE_TO_REGISTER,
    ViolationType.ILLEGAL_EMPLOYMENT,
    ViolationType.ILLEGAL_HIRING,
    ViolationType.DOCUMENT_REJECTION_FOLLOWUP,
    // Security
    ViolationType.PROHIBITED_IMMIGRANT,
    ViolationType.CRIMINAL_CONVICTION,
    ViolationType.THREAT_TO_NATIONAL_SECURITY,
    ViolationType.SUSPECTED_HUMAN_TRAFFICKING,
  ] as const),
  severity: z.enum([
    ViolationSeverity.LOW,
    ViolationSeverity.MEDIUM,
    ViolationSeverity.HIGH,
    ViolationSeverity.CRITICAL,
  ] as const),
  description: z.string().min(10).max(1000),
});

type ReportViolationRequest = z.infer<typeof ReportViolationSchema>;

/**
 * POST /api/public/report-violation
 *
 * Public endpoint for reporting immigration violations.
 * Accepts anonymous reports and authenticated officer reports.
 *
 * Categorizes violations into 4 Legal Domains:
 * 1. Temporal (Status & Duration)
 * 2. Integrity (Documentary & Identity)
 * 3. Regulatory (Compliance & Administrative)
 * 4. Security (High Priority)
 *
 * Implements intelligent auto-routing based on domain and severity.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const validation = ReportViolationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const input: ReportViolationRequest = validation.data;

    // Extract actor context (for authenticated reports)
    const securityContext = buildSecurityContext(request.headers);

    // Build controller via composition root
    const controller = buildViolationController(securityContext);

    // Execute use case
    const result = await controller.reportViolation({
      individualId: input.individualId || null,
      violationType: input.violationType as ViolationType,
      severity: input.severity as ViolationSeverity,
      description: input.description,
      reportContext: {
        subjectType: input.subjectType || null,
        subject: input.subject || null,
        reporter: input.reporter || null,
      },
      reportedByActorId: securityContext.actorId || null,
    } as ReportViolationCommand, securityContext);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        violationId: result.violationId,
        routing: {
          domain: result.routing.domain,
          priority: result.routing.priority,
          targetAudience: result.routing.targetAudience,
          requiresImmediateEscalation: result.routing.requiresImmediateEscalation,
          autoGeneratedAction: result.routing.autoGeneratedAction,
          notificationsSent: result.routing.notificationRecipient ? 1 : 0,
        },
        message: "Violation reported successfully and routed for processing",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error reporting violation:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to report violation",
        message: errorMessage,
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/public/report-violation
 *
 * Returns documentation about violation types and domains.
 */
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/public/report-violation",
    method: "POST",
    description:
      "Report an immigration law violation. Violations are automatically categorized into 4 legal domains and routed for processing.",
    domains: {
      TEMPORAL: "Status & Duration Violations (ETA overstay, expired permits, breach of conditions)",
      INTEGRITY: "Documentary & Identity Violations (forgery, misrepresentation, failure to notify)",
      REGULATORY: "Compliance & Administrative Violations (failure to register, illegal employment)",
      SECURITY: "Security & Public Interest Violations (prohibited immigrant, criminal conviction, terrorism threat)",
    },
    violationTypes: {
      // Temporal
      ETA_OVERSTAY: "Remaining in Kenya beyond authorized period",
      EXPIRED_PERMIT: "Failure to renew work, study, or residency permit",
      BREACH_OF_CONDITIONS: "Unauthorized activities under visa type",
      // Integrity
      DOCUMENT_FORGERY: "Submission of altered or fake documents",
      MATERIAL_MISREPRESENTATION: "False information in application",
      FAILURE_TO_NOTIFY: "Not notifying Immigration of address/employer/marital status changes",
      // Regulatory
      FAILURE_TO_REGISTER: "Foreign national failing to register after 90 days",
      ILLEGAL_EMPLOYMENT: "Individual working without permit",
      ILLEGAL_HIRING: "Kenyan employer hiring undocumented person",
      DOCUMENT_REJECTION_FOLLOWUP: "Failure to leave or appeal after document rejection",
      // Security
      PROHIBITED_IMMIGRANT: "Previously deported or blacklisted person attempting re-entry",
      CRIMINAL_CONVICTION: "Non-citizen convicted of offense punishable by 3+ years imprisonment",
      THREAT_TO_NATIONAL_SECURITY: "Involvement in terrorism, espionage, or organized crime",
      SUSPECTED_HUMAN_TRAFFICKING: "Indicators of trafficking, coercion, organised transportation or exploitation of persons",
    },
    severities: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    exampleRequest: {
      method: "POST",
      url: "/api/public/report-violation",
      body: {
        individualId: "john@example.com",
        violationType: "ETA_OVERSTAY",
        severity: "HIGH",
        description: "Individual has remained in Kenya 6 months beyond ETA expiration date",
      },
    },
    exampleResponse: {
      success: true,
      violationId: "550e8400-e29b-41d4-a716-446655440000",
      routing: {
        domain: "TEMPORAL",
        priority: "HIGH",
        targetAudience: "SUPERVISOR",
        requiresImmediateEscalation: true,
        autoGeneratedAction: "Notice to Regularize or Voluntary Departure Letter",
        notificationsSent: 2,
      },
      message: "Violation reported successfully and routed for processing",
    },
    autoRoutingLogic: {
      TEMPORAL_LOW_MEDIUM: "SMS notification to individual + SMS reminder",
      TEMPORAL_HIGH_CRITICAL: "SMS + escalate to supervisor + generate notice letter",
      INTEGRITY_ANY: "Officer review + document verification + possible record lock if critical",
      REGULATORY_LOW_MEDIUM: "Officer review + scheduled compliance check",
      REGULATORY_HIGH_CRITICAL: "Escalate to supervisor + compliance review + possible record lock",
      SECURITY_ANY: "IMMEDIATE DIRECTOR NOTIFICATION + lock individual record + security ops alert",
    },
  });
}
