import { ValidationError } from "@/Domain/Exceptions/DomainError";

export class Recommendation {
  constructor(
    public readonly id: string,
    public readonly caseId: string,
    public readonly authorOfficerId: string,
    public readonly summary: string,
    public readonly createdAt: Date
  ) {
    if (!id.trim()) throw new ValidationError("Recommendation id is required");
    if (!caseId.trim()) throw new ValidationError("Case id is required");
    if (!authorOfficerId.trim()) throw new ValidationError("Author officer id is required");
    if (!summary.trim()) throw new ValidationError("Recommendation summary is required");
  }
}
