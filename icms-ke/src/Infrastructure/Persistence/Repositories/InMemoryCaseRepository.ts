import { ImmigrationCase } from "@/Domain/Entities/ImmigrationCase";
import { CASE_STATUS } from "@/Domain/ValueObjects/CaseStatus";
import { CaseRepository } from "@/Domain/Repositories/CaseRepository";

export class InMemoryCaseRepository implements CaseRepository {
  private readonly store = new Map<string, ImmigrationCase>();

  async findById(id: string): Promise<ImmigrationCase | null> {
    return this.store.get(id) ?? null;
  }

  async save(entity: ImmigrationCase): Promise<void> {
    this.store.set(entity.id, entity);
  }

  async findOpenCasesByIndividualId(individualId: string): Promise<ImmigrationCase[]> {
    return Array.from(this.store.values()).filter(
      (item) => item.individualId === individualId && item.status !== CASE_STATUS.CLOSED
    );
  }
}
