import { ImmigrationCase } from "@/Domain/Entities/ImmigrationCase";

export interface CaseRepository {
  findById(id: string): Promise<ImmigrationCase | null>;
  save(entity: ImmigrationCase): Promise<void>;
  findOpenCasesByIndividualId(individualId: string): Promise<ImmigrationCase[]>;
}
