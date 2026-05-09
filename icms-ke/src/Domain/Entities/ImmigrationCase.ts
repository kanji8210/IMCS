import { ValidationError } from "@/Domain/Exceptions/DomainError";
import { CASE_STATUS, CaseStatus } from "@/Domain/ValueObjects/CaseStatus";
import { RiskLevel } from "@/Domain/ValueObjects/RiskLevel";

export class ImmigrationCase {
  private _status: CaseStatus;

  constructor(
    public readonly id: string,
    public readonly individualId: string,
    public readonly reason: string,
    public readonly createdAt: Date,
    public readonly assignedOfficerId: string,
    public readonly riskLevel: RiskLevel,
    initialStatus: CaseStatus = CASE_STATUS.OPEN
  ) {
    if (!id.trim()) throw new ValidationError("Case id is required");
    if (!individualId.trim()) throw new ValidationError("Individual id is required");
    if (!reason.trim()) throw new ValidationError("Case reason is required");
    if (!assignedOfficerId.trim()) throw new ValidationError("Assigned officer id is required");

    this._status = initialStatus;
  }

  get status(): CaseStatus {
    return this._status;
  }

  markUnderReview(): void {
    this._status = CASE_STATUS.UNDER_REVIEW;
  }

  markRecommended(): void {
    this._status = CASE_STATUS.RECOMMENDED;
  }

  close(): void {
    this._status = CASE_STATUS.CLOSED;
  }
}
