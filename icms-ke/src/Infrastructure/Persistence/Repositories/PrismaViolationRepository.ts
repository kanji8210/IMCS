import { Violation, ViolationSeverity, ViolationStatus } from "../../../Domain/Entities/Violation";
import { ViolationRepository } from "../../../Domain/Repositories/ViolationRepository";
import { ViolationType, ViolationDomain } from "../../../Domain/ValueObjects/ViolationType";
import { PrismaClient, Violation as PrismaViolation } from "@prisma/client";

/**
 * PrismaViolationRepository - Infrastructure Repository Implementation
 *
 * Maps between domain Violation entities and Prisma database models.
 * Implements the ViolationRepository port.
 */
export class PrismaViolationRepository implements ViolationRepository {
  constructor(private db: PrismaClient) {}

  async save(violation: Violation): Promise<void> {
    const updateData: any = {
      status: violation.getStatus() as unknown as PrismaViolation['status'],
      reportContext: violation.getReportContext() as any,
      updatedAt: violation.getUpdatedAt(),
    };

    const createData: any = {
      id: violation.getId(),
      individualId: violation.getIndividualId(),
      type: violation.getType() as unknown as PrismaViolation['type'],
      domain: violation.getDomain() as unknown as PrismaViolation['domain'],
      severity: violation.getSeverity() as unknown as PrismaViolation['severity'],
      description: violation.getDescription(),
      reportContext: violation.getReportContext() as any,
      reportedByActorId: violation.getReportedByActorId(),
      status: violation.getStatus() as unknown as PrismaViolation['status'],
      createdAt: violation.getCreatedAt(),
      updatedAt: violation.getUpdatedAt(),
    };

    await this.db.violation.upsert({
      where: { id: violation.getId() },
      update: updateData,
      create: createData,
    });
  }

  async findById(id: string): Promise<Violation | null> {
    const record = await this.db.violation.findUnique({
      where: { id },
    });

    if (!record) return null;

    return this.toDomainEntity(record);
  }

  async findByIndividualId(individualId: string): Promise<Violation[]> {
    const records = await this.db.violation.findMany({
      where: { individualId },
      orderBy: { createdAt: "desc" },
    });

    return records.map((r) => this.toDomainEntity(r));
  }

  async findByType(type: ViolationType): Promise<Violation[]> {
    const records = await this.db.violation.findMany({
      where: { type: type as unknown as PrismaViolation['type'] },
      orderBy: { createdAt: "desc" },
    });

    return records.map((r) => this.toDomainEntity(r));
  }

  async findByDomain(domain: ViolationDomain): Promise<Violation[]> {
    const records = await this.db.violation.findMany({
      where: { domain: domain as unknown as PrismaViolation['domain'] },
      orderBy: { createdAt: "desc" },
    });

    return records.map((r) => this.toDomainEntity(r));
  }

  async findAll(page: number, limit: number): Promise<{ violations: Violation[]; total: number }> {
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      this.db.violation.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.db.violation.count(),
    ]);

    return {
      violations: records.map((r) => this.toDomainEntity(r)),
      total,
    };
  }

  async findPendingReview(): Promise<Violation[]> {
    const records = await this.db.violation.findMany({
      where: {
        status: {
          in: ["REPORTED", "UNDER_REVIEW"] as unknown as PrismaViolation['status'][],
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return records.map((r) => this.toDomainEntity(r));
  }

  async findSecurityViolations(): Promise<Violation[]> {
    const records = await this.db.violation.findMany({
      where: { domain: "SECURITY" as unknown as PrismaViolation['domain'] },
      orderBy: [{ severity: "desc" }, { createdAt: "desc" }],
    });

    return records.map((r) => this.toDomainEntity(r));
  }

  async countByDomain(domain: ViolationDomain): Promise<number> {
    return this.db.violation.count({
      where: { domain: domain as unknown as PrismaViolation['domain'] },
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.violation.delete({
      where: { id },
    });
  }

  /**
   * Map Prisma record to domain entity
   */
  private toDomainEntity(record: PrismaViolation): Violation {
    return new Violation({
      id: record.id,
      individualId: record.individualId,
      type: record.type as ViolationType,
      severity: record.severity as ViolationSeverity,
      description: record.description,
      reportContext: (record as any).reportContext ?? null,
      reportedByActorId: record.reportedByActorId,
      status: record.status as ViolationStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
