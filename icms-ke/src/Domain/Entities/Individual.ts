import { ValidationError } from "@/Domain/Exceptions/DomainError";

export class Individual {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly countryCode: string
  ) {
    if (!id.trim()) throw new ValidationError("Individual id is required");
    if (!fullName.trim()) throw new ValidationError("Individual full name is required");
    if (!email.trim()) throw new ValidationError("Individual email is required");
  }
}
