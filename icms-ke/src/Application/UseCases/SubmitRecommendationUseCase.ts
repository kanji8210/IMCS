import { SubmitRecommendationCommand } from "@/Application/DTOs/Commands";
import { Recommendation } from "@/Domain/Entities/Recommendation";
import { AuthorizationError, ValidationError } from "@/Domain/Exceptions/DomainError";
import { CaseRepository } from "@/Domain/Repositories/CaseRepository";
import { RecommendationRepository } from "@/Domain/Repositories/RecommendationRepository";
import { AuditPort, ClockPort, PolicyService, SecurityContext } from "@/Domain/Services/Ports";

export class SubmitRecommendationUseCase {
  constructor(
    private readonly policyService: PolicyService,
    private readonly caseRepository: CaseRepository,
    private readonly recommendationRepository: RecommendationRepository,
    private readonly auditPort: AuditPort,
    private readonly clock: ClockPort
  ) {}

  async execute(command: SubmitRecommendationCommand, context: SecurityContext): Promise<string> {
    if (!command.summary.trim()) {
      throw new ValidationError("Recommendation summary is required");
    }

    const caseEntity = await this.caseRepository.findById(command.caseId);
    if (!caseEntity) {
      throw new ValidationError("Case not found");
    }

    const allowed = this.policyService.canExecute("submitRecommendation", context, caseEntity.assignedOfficerId);
    if (!allowed) {
      throw new AuthorizationError("You are not allowed to submit recommendation for this case");
    }

    const recommendation = new Recommendation(
      `rec_${crypto.randomUUID()}`,
      command.caseId,
      context.actorId,
      command.summary,
      this.clock.now()
    );

    caseEntity.markRecommended();
    await this.recommendationRepository.save(recommendation);
    await this.caseRepository.save(caseEntity);

    await this.auditPort.write({
      actorId: context.actorId,
      action: "SUBMIT_RECOMMENDATION",
      entityType: "ImmigrationCase",
      entityId: caseEntity.id,
      occurredAt: this.clock.now(),
    });

    return recommendation.id;
  }
}
