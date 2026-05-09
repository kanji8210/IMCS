import { ETARecord } from "@/Domain/Entities/ETARecord";
import { Individual } from "@/Domain/Entities/Individual";
import { IndividualRepository } from "@/Domain/Repositories/IndividualRepository";
import { PrismaClient } from "@prisma/client";

export class PrismaIndividualRepository implements IndividualRepository {
  constructor(private readonly db: PrismaClient) {}

  async findById(id: string): Promise<Individual | null> {
    const row = await this.db.individual.findUnique({ where: { id } });
    if (!row) return null;

    return new Individual(row.id, row.fullName, row.email, row.phoneNumber, row.countryCode);
  }

  async findByExpiringETA(
    windowDays: number,
    now: Date
  ): Promise<Array<{ individual: Individual; eta: ETARecord }>> {
    const end = new Date(now.getTime() + windowDays * 24 * 60 * 60 * 1000);

    const rows = await this.db.etaRecord.findMany({
      where: {
        expiresAt: {
          gte: now,
          lte: end,
        },
      },
      include: {
        individual: true,
      },
      orderBy: { expiresAt: "asc" },
    });

    return rows.map((row) => ({
      individual: new Individual(
        row.individual.id,
        row.individual.fullName,
        row.individual.email,
        row.individual.phoneNumber,
        row.individual.countryCode
      ),
      eta: new ETARecord(row.id, row.individualId, row.etaNumber, row.expiresAt),
    }));
  }
}
