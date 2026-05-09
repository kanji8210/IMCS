import { Recommendation } from "@/Domain/Entities/Recommendation";
import { RecommendationRepository } from "@/Domain/Repositories/RecommendationRepository";

export class InMemoryRecommendationRepository implements RecommendationRepository {
  private readonly store = new Map<string, Recommendation[]>();

  async save(entity: Recommendation): Promise<void> {
    const existing = this.store.get(entity.caseId) ?? [];
    this.store.set(entity.caseId, [...existing, entity]);
  }

  async findByCaseId(caseId: string): Promise<Recommendation[]> {
    return this.store.get(caseId) ?? [];
  }
}
