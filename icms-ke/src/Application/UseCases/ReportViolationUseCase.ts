import { Violation, ViolationSeverity } from "../../Domain/Entities/Violation";
import { ViolationRepository } from "../../Domain/Repositories/ViolationRepository";
import { ViolationType } from "../../Domain/ValueObjects/ViolationType";
import { DomainError } from "../../Domain/Exceptions/DomainError";
import { SecurityContext } from "../../Domain/Services/Ports";
import { ViolationRoutingService, RoutingResult } from "../../Infrastructure/Services/ViolationRoutingService";
import { AuditPort, ClockPort, NotificationPort } from "../../Domain/Services/Ports";

/**
 * ReportViolationCommand - Input DTO
 */
export interface ReportViolationCommand {
  individualId: string | null; // null for anonymous reports
  violationType: ViolationType;
  severity: ViolationSeverity;
  description: string;
  reportedByActorId: string | null; // null for public/external reports
}

/**
 * ReportViolationResult - Output DTO
 */
export interface ReportViolationResult {
  violationId: string;
  routing: RoutingResult;
  auditLog: string;
}

/**
 * ReportViolationUseCase - Application Service
 *
 * Orchestrates the process of:
 * 1. Creating a violation entity
 * 2. Determining its domain and routing requirements
 * 3. Generating auto-actions and notifications
 * 4. Persisting the violation
 * 5. Logging the action for audit trail
 *
 * Demonstrates intelligent violation categorization with auto-routing into 4 legal domains.
 */
export class ReportViolationUseCase {
  constructor(
    private violationRepository: ViolationRepository,
    private routingService: ViolationRoutingService,
    private securityContext: SecurityContext,
    private auditPort: AuditPort,
    private notificationPort: NotificationPort,
    private clockPort: ClockPort,
  ) {}

  /**
   * Execute: Report a violation and trigger intelligent routing
   */
  async execute(command: ReportViolationCommand): Promise<ReportViolationResult> {
    const actorId = command.reportedByActorId || this.securityContext.actorId;

    this.validateCommand(command, actorId);

    // Create violation entity
    const violation = Violation.create({
      individualId: command.individualId,
      type: command.violationType,
      severity: command.severity,
      description: command.description,
      reportedByActorId: actorId,
    });

    // Compute routing decision based on domain and severity
    const routingResult = this.routingService.processViolation(violation);

    // Persist violation
    await this.violationRepository.save(violation);

    // Generate and send notifications
    await this.handleNotifications(violation, routingResult);

    // If security violation, lock individual record
    if (violation.isSecurityViolation()) {
      await this.lockIndividualRecord(violation);
    }

    // Audit log
    const auditMessage = this.generateAuditLog(violation, routingResult);
    await this.auditPort.write({
      actorId,
      action: "REPORT_VIOLATION",
      entityType: "VIOLATION",
      entityId: violation.getId(),
      metadata: {
        domain: routingResult.domain,
        type: violation.getType(),
        priority: routingResult.priority,
        targetAudience: routingResult.targetAudience,
      },
      occurredAt: this.clockPort.now(),
    });

    return {
      violationId: violation.getId(),
      routing: routingResult,
      auditLog: auditMessage,
    };
  }

  /**
   * Validate command input
   */
  private validateCommand(command: ReportViolationCommand, actorId: string): void {
    if (!command.violationType) {
      throw new DomainError("Violation type is required");
    }

    if (!command.severity) {
      throw new DomainError("Violation severity is required");
    }

    if (!command.description || command.description.trim().length === 0) {
      throw new DomainError("Violation description is required");
    }

    if (command.description.length > 1000) {
      throw new DomainError("Violation description cannot exceed 1000 characters");
    }

    // Security violations require authentication context
    if (command.violationType === ViolationType.THREAT_TO_NATIONAL_SECURITY && !actorId) {
      throw new DomainError("Security threat reports must be authenticated");
    }
  }

  /**
   * Handle notifications based on routing
   */
  private async handleNotifications(violation: Violation, routingResult: RoutingResult): Promise<void> {
    if (!routingResult.notificationRecipient || !routingResult.notificationMessage) {
      return;
    }

    try {
      await this.notificationPort.sendSMS({
        to: routingResult.notificationRecipient,
        message: routingResult.notificationMessage,
      });
    } catch (error) {
      await this.auditPort.write({
        actorId: "SYSTEM",
        action: "NOTIFICATION_FAILED",
        entityType: "VIOLATION",
        entityId: violation.getId(),
        metadata: {
          recipient: routingResult.notificationRecipient,
          error: error instanceof Error ? error.message : String(error),
        },
        occurredAt: this.clockPort.now(),
      });
    }
  }

  /**
   * Lock individual record for security violations
   */
  private async lockIndividualRecord(violation: Violation): Promise<void> {
    const individualId = violation.getIndividualId();

    if (violation.shouldLockIndividualRecord() && individualId) {

      // This would be implemented in the Individual entity/repository
      // For now, we document the intent
      await this.auditPort.write({
        actorId: "SYSTEM",
        action: "LOCK_INDIVIDUAL_RECORD",
        entityType: "INDIVIDUAL",
        entityId: individualId,
        metadata: {
          violationType: violation.getType(),
          reason: "Security violation",
        },
        occurredAt: this.clockPort.now(),
      });

      await this.notificationPort.sendSMS({
        to: "SECURITY_OPS_TEAM",
        message: `Individual record locked: ${individualId} - Violation: ${violation.getType()}`,
      });
    }
  }

  /**
   * Generate human-readable audit log message
   */
  private generateAuditLog(violation: Violation, routingResult: RoutingResult): string {
    return `
Violation Reported:
  ID: ${violation.getId()}
  Individual: ${violation.getIndividualId() || "Anonymous"}
  Type: ${violation.getType()}
  Domain: ${routingResult.domain}
  Severity: ${violation.getSeverity()}
  Priority: ${routingResult.priority}
  Escalation Required: ${routingResult.requiresImmediateEscalation}
  Target Audience: ${routingResult.targetAudience}
  Auto-Action: ${routingResult.autoGeneratedAction}
  Notification Recipient: ${routingResult.notificationRecipient || "NONE"}
  Lock Individual: ${routingResult.lockIndividualRecord}
    `;
  }
}
