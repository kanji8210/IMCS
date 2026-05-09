import { CaseRepository } from "@/Domain/Repositories/CaseRepository";
import { ImmigrationCase } from "@/Domain/Entities/ImmigrationCase";
import { CASE_STATUS } from "@/Domain/ValueObjects/CaseStatus";
import { PrismaClient, RiskLevel as PrismaRiskLevel } from "@prisma/client";

export class PrismaCaseRepository implements CaseRepository {
  constructor(private readonly db: PrismaClient) {}

  async findById(id: string): Promise<ImmigrationCase | null> {
    const row = await this.db.immigrationCase.findUnique({ where: { id } });
    if (!row) return null;

    return new ImmigrationCase(
      row.id,
      row.individualId,
      row.reason,
      row.createdAt,
      row.assignedOfficerId,
      row.riskLevel,
      row.status
    );
  }

  async save(entity: ImmigrationCase): Promise<void> {
    await this.db.immigrationCase.upsert({
      where: { id: entity.id },
      create: {
        id: entity.id,
        individualId: entity.individualId,
        reason: entity.reason,
        assignedOfficerId: entity.assignedOfficerId,
        riskLevel: entity.riskLevel as PrismaRiskLevel,
        status: entity.status,
        createdAt: entity.createdAt,
      },
      update: {
        reason: entity.reason,
        assignedOfficerId: entity.assignedOfficerId,
        riskLevel: entity.riskLevel as PrismaRiskLevel,
        status: entity.status,
      },
    });
  }

  async findOpenCasesByIndividualId(individualId: string): Promise<ImmigrationCase[]> {
    const rows = await this.db.immigrationCase.findMany({
      where: {
        individualId,
        status: {
          not: CASE_STATUS.CLOSED,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return rows.map(
      (row) =>
        new ImmigrationCase(
          row.id,
          row.individualId,
          row.reason,
          row.createdAt,
          row.assignedOfficerId,
          row.riskLevel,
          row.status
        )
    );
  }
}
