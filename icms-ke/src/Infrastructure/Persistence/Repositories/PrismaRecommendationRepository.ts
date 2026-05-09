import { Recommendation } from "@/Domain/Entities/Recommendation";
import { RecommendationRepository } from "@/Domain/Repositories/RecommendationRepository";
import { PrismaClient } from "@prisma/client";

export class PrismaRecommendationRepository implements RecommendationRepository {
  constructor(private readonly db: PrismaClient) {}

  async save(entity: Recommendation): Promise<void> {
    await this.db.recommendation.upsert({
      where: { id: entity.id },
      create: {
        id: entity.id,
        caseId: entity.caseId,
        authorOfficerId: entity.authorOfficerId,
        summary: entity.summary,
        createdAt: entity.createdAt,
      },
      update: {
        summary: entity.summary,
      },
    });
  }

  async findByCaseId(caseId: string): Promise<Recommendation[]> {
    const rows = await this.db.recommendation.findMany({
      where: { caseId },
      orderBy: { createdAt: "desc" },
    });

    return rows.map(
      (row) => new Recommendation(row.id, row.caseId, row.authorOfficerId, row.summary, row.createdAt)
    );
  }
}
