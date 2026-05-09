import { FlagExpiringETAUseCase } from "@/Application/UseCases/FlagExpiringETAUseCase";
import { ProcessDocumentRejectionUseCase } from "@/Application/UseCases/ProcessDocumentRejectionUseCase";
import { SubmitRecommendationUseCase } from "@/Application/UseCases/SubmitRecommendationUseCase";
import { SecurityContext } from "@/Domain/Services/Ports";

export class CaseController {
  constructor(
    private readonly flagExpiringETAUseCase: FlagExpiringETAUseCase,
    private readonly processDocumentRejectionUseCase: ProcessDocumentRejectionUseCase,
    private readonly submitRecommendationUseCase: SubmitRecommendationUseCase
  ) {}

  async flagExpiringETA(windowDays: number, context: SecurityContext): Promise<{ flagged: number }> {
    const flagged = await this.flagExpiringETAUseCase.execute({ windowDays }, context);
    return { flagged };
  }

  async processDocumentRejection(
    input: {
      individualId: string;
      assignedOfficerId: string;
      rejectionReason: string;
      riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    },
    context: SecurityContext
  ): Promise<{ caseId: string }> {
    const caseId = await this.processDocumentRejectionUseCase.execute(input, context);
    return { caseId };
  }

  async submitRecommendation(input: { caseId: string; summary: string }, context: SecurityContext): Promise<{ recommendationId: string }> {
    const recommendationId = await this.submitRecommendationUseCase.execute(input, context);
    return { recommendationId };
  }
}
