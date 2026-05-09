import { FlagExpiringETACommand } from "@/Application/DTOs/Commands";
import { AuthorizationError, ValidationError } from "@/Domain/Exceptions/DomainError";
import { IndividualRepository } from "@/Domain/Repositories/IndividualRepository";
import { AuditPort, NotificationPort, PolicyService, SecurityContext } from "@/Domain/Services/Ports";

export class FlagExpiringETAUseCase {
  constructor(
    private readonly policyService: PolicyService,
    private readonly individualRepository: IndividualRepository,
    private readonly notificationPort: NotificationPort,
    private readonly auditPort: AuditPort
  ) {}

  async execute(command: FlagExpiringETACommand, context: SecurityContext): Promise<number> {
    if (command.windowDays < 1 || command.windowDays > 365) {
      throw new ValidationError("windowDays must be between 1 and 365");
    }

    const allowed = this.policyService.canExecute("flagExpiringEta", context);
    if (!allowed) {
      throw new AuthorizationError("You are not allowed to flag expiring ETA records");
    }

    const expiring = await this.individualRepository.findByExpiringETA(command.windowDays, new Date());

    for (const item of expiring) {
      await this.notificationPort.sendSMS({
        to: item.individual.phoneNumber,
        message: `Your ETA (${item.eta.etaNumber}) is expiring on ${item.eta.expiresAt.toISOString().slice(0, 10)}. Please take action.`,
      });

      await this.auditPort.write({
        actorId: context.actorId,
        action: "NOTIFY_EXPIRING_ETA",
        entityType: "Individual",
        entityId: item.individual.id,
        metadata: { windowDays: command.windowDays, etaNumber: item.eta.etaNumber },
        occurredAt: new Date(),
      });
    }

    return expiring.length;
  }
}
