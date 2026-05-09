import { Recommendation } from "@/Domain/Entities/Recommendation";

export interface RecommendationRepository {
  save(entity: Recommendation): Promise<void>;
  findByCaseId(caseId: string): Promise<Recommendation[]>;
}
