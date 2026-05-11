import { ReportViolationUseCase } from "@/Application/UseCases/ReportViolationUseCase";
import { PrismaViolationRepository } from "@/Infrastructure/Persistence/Repositories/PrismaViolationRepository";
import { ViolationRoutingService } from "@/Infrastructure/Services/ViolationRoutingService";
import { ConsoleAuditAdapter } from "@/Infrastructure/External/ConsoleAuditAdapter";
import { ConsoleNotificationAdapter } from "@/Infrastructure/External/ConsoleNotificationAdapter";
import { SystemClock } from "@/Infrastructure/External/SystemClock";
import { prisma } from "@/Infrastructure/Persistence/prismaClient";
import { ViolationController } from "@/Presentation/Controllers/ViolationController";
import { SecurityContext } from "@/Domain/Services/Ports";

export function buildViolationController(securityContext: SecurityContext): ViolationController {
  const violationRepository = new PrismaViolationRepository(prisma);
  const routingService = new ViolationRoutingService();
  const auditPort = new ConsoleAuditAdapter();
  const notificationPort = new ConsoleNotificationAdapter();
  const clock = new SystemClock();

  const reportViolationUseCase = new ReportViolationUseCase(
    violationRepository,
    routingService,
    securityContext,
    auditPort,
    notificationPort,
    clock,
  );

  return new ViolationController(reportViolationUseCase);
}
