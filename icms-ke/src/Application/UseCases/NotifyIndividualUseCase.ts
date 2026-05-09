import { NotifyIndividualCommand } from "@/Application/DTOs/Commands";
import { AuthorizationError, ValidationError } from "@/Domain/Exceptions/DomainError";
import { IndividualRepository } from "@/Domain/Repositories/IndividualRepository";
import { AuditPort, NotificationPort, PolicyService, SecurityContext } from "@/Domain/Services/Ports";

export class NotifyIndividualUseCase {
  constructor(
    private readonly policyService: PolicyService,
    private readonly individualRepository: IndividualRepository,
    private readonly notificationPort: NotificationPort,
    private readonly auditPort: AuditPort
  ) {}

  async execute(command: NotifyIndividualCommand, context: SecurityContext): Promise<void> {
    const allowed = this.policyService.canExecute("notifyIndividual", context);
    if (!allowed) {
      throw new AuthorizationError("You are not allowed to notify individuals");
    }

    const individual = await this.individualRepository.findById(command.individualId);
    if (!individual) {
      throw new ValidationError("Individual not found");
    }

    await this.notificationPort.sendSMS({ to: individual.phoneNumber, message: command.message });

    await this.auditPort.write({
      actorId: context.actorId,
      action: "NOTIFY_INDIVIDUAL",
      entityType: "Individual",
      entityId: individual.id,
      occurredAt: new Date(),
    });
  }
}
