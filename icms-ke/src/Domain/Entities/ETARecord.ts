import { ValidationError } from "@/Domain/Exceptions/DomainError";

export class ETARecord {
  constructor(
    public readonly id: string,
    public readonly individualId: string,
    public readonly etaNumber: string,
    public readonly expiresAt: Date
  ) {
    if (!id.trim()) throw new ValidationError("ETA record id is required");
    if (!individualId.trim()) throw new ValidationError("Individual id is required");
    if (!etaNumber.trim()) throw new ValidationError("ETA number is required");
  }

  isExpiringWithin(days: number, now: Date): boolean {
    const msPerDay = 24 * 60 * 60 * 1000;
    const diffInDays = (this.expiresAt.getTime() - now.getTime()) / msPerDay;
    return diffInDays >= 0 && diffInDays <= days;
  }
}
