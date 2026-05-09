import { FlagExpiringETAUseCase } from "@/Application/UseCases/FlagExpiringETAUseCase";
import { ProcessDocumentRejectionUseCase } from "@/Application/UseCases/ProcessDocumentRejectionUseCase";
import { SubmitRecommendationUseCase } from "@/Application/UseCases/SubmitRecommendationUseCase";
import { CaseController } from "@/Presentation/Controllers/CaseController";
import { RolePolicyService } from "@/Infrastructure/Auth/RolePolicyService";
import { ConsoleAuditAdapter } from "@/Infrastructure/External/ConsoleAuditAdapter";
import { ConsoleNotificationAdapter } from "@/Infrastructure/External/ConsoleNotificationAdapter";
import { SystemClock } from "@/Infrastructure/External/SystemClock";
import { prisma } from "@/Infrastructure/Persistence/prismaClient";
import { PrismaCaseRepository } from "@/Infrastructure/Persistence/Repositories/PrismaCaseRepository";
import { PrismaIndividualRepository } from "@/Infrastructure/Persistence/Repositories/PrismaIndividualRepository";
import { PrismaRecommendationRepository } from "@/Infrastructure/Persistence/Repositories/PrismaRecommendationRepository";

export function buildCaseController(): CaseController {
  const policyService = new RolePolicyService();
  const caseRepository = new PrismaCaseRepository(prisma);
  const individualRepository = new PrismaIndividualRepository(prisma);
  const recommendationRepository = new PrismaRecommendationRepository(prisma);
  const notificationPort = new ConsoleNotificationAdapter();
  const auditPort = new ConsoleAuditAdapter();
  const clock = new SystemClock();

  const flagExpiringETAUseCase = new FlagExpiringETAUseCase(
    policyService,
    individualRepository,
    notificationPort,
    auditPort
  );

  const processDocumentRejectionUseCase = new ProcessDocumentRejectionUseCase(
    policyService,
    caseRepository,
    auditPort,
    clock
  );

  const submitRecommendationUseCase = new SubmitRecommendationUseCase(
    policyService,
    caseRepository,
    recommendationRepository,
    auditPort,
    clock
  );

  return new CaseController(
    flagExpiringETAUseCase,
    processDocumentRejectionUseCase,
    submitRecommendationUseCase
  );
}
