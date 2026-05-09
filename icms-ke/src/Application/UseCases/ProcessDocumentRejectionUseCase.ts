import { ProcessDocumentRejectionCommand } from "@/Application/DTOs/Commands";
import { ImmigrationCase } from "@/Domain/Entities/ImmigrationCase";
import { AuthorizationError } from "@/Domain/Exceptions/DomainError";
import { CaseRepository } from "@/Domain/Repositories/CaseRepository";
import { AuditPort, ClockPort, PolicyService, SecurityContext } from "@/Domain/Services/Ports";

export class ProcessDocumentRejectionUseCase {
  constructor(
    private readonly policyService: PolicyService,
    private readonly caseRepository: CaseRepository,
    private readonly auditPort: AuditPort,
    private readonly clock: ClockPort
  ) {}

  async execute(command: ProcessDocumentRejectionCommand, context: SecurityContext): Promise<string> {
    const allowed = this.policyService.canExecute("processDocumentRejection", context, command.assignedOfficerId);
    if (!allowed) {
      throw new AuthorizationError("You are not allowed to process this document rejection");
    }

    const id = `case_${crypto.randomUUID()}`;
    const caseEntity = new ImmigrationCase(
      id,
      command.individualId,
      `Document rejection: ${command.rejectionReason}`,
      this.clock.now(),
      command.assignedOfficerId,
      command.riskLevel
    );

    caseEntity.markUnderReview();
    await this.caseRepository.save(caseEntity);

    await this.auditPort.write({
      actorId: context.actorId,
      action: "CREATE_CASE_FOR_DOCUMENT_REJECTION",
      entityType: "ImmigrationCase",
      entityId: caseEntity.id,
      metadata: { riskLevel: command.riskLevel },
      occurredAt: this.clock.now(),
    });

    return caseEntity.id;
  }
}
