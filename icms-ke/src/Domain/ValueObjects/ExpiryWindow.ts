import { ValidationError } from "@/Domain/Exceptions/DomainError";

export class ExpiryWindow {
  readonly days: number;

  constructor(days: number) {
    if (!Number.isInteger(days) || days < 1 || days > 365) {
      throw new ValidationError("Expiry window must be an integer between 1 and 365 days");
    }

    this.days = days;
  }
}
