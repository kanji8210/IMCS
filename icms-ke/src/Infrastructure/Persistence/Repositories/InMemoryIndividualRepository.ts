import { ETARecord } from "@/Domain/Entities/ETARecord";
import { Individual } from "@/Domain/Entities/Individual";
import { IndividualRepository } from "@/Domain/Repositories/IndividualRepository";

export class InMemoryIndividualRepository implements IndividualRepository {
  private readonly individuals = new Map<string, Individual>();
  private readonly etaRecords = new Map<string, ETARecord>();

  seed(individual: Individual, etaRecord: ETARecord): void {
    this.individuals.set(individual.id, individual);
    this.etaRecords.set(etaRecord.id, etaRecord);
  }

  async findById(id: string): Promise<Individual | null> {
    return this.individuals.get(id) ?? null;
  }

  async findByExpiringETA(
    windowDays: number,
    now: Date
  ): Promise<Array<{ individual: Individual; eta: ETARecord }>> {
    const result: Array<{ individual: Individual; eta: ETARecord }> = [];

    for (const eta of this.etaRecords.values()) {
      if (!eta.isExpiringWithin(windowDays, now)) continue;
      const individual = this.individuals.get(eta.individualId);
      if (!individual) continue;
      result.push({ individual, eta });
    }

    return result;
  }
}
