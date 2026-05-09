import { Violation } from "../Entities/Violation";
import { ViolationType, ViolationDomain } from "../ValueObjects/ViolationType";

/**
 * ViolationRepository - Domain Repository Port
 * 
 * Defines the contract for persistence operations on violations.
 * Implementation in Infrastructure Layer (Prisma).
 */
export interface ViolationRepository {
  /**
   * Save a new or updated violation
   */
  save(violation: Violation): Promise<void>;

  /**
   * Find violation by ID
   */
  findById(id: string): Promise<Violation | null>;

  /**
   * Find all violations for an individual
   */
  findByIndividualId(individualId: string): Promise<Violation[]>;

  /**
   * Find violations by type
   */
  findByType(type: ViolationType): Promise<Violation[]>;

  /**
   * Find violations by domain
   */
  findByDomain(domain: ViolationDomain): Promise<Violation[]>;

  /**
   * Find all violations (paginated)
   */
  findAll(page: number, limit: number): Promise<{ violations: Violation[]; total: number }>;

  /**
   * Find violations pending review
   */
  findPendingReview(): Promise<Violation[]>;

  /**
   * Find security violations requiring immediate attention
   */
  findSecurityViolations(): Promise<Violation[]>;

  /**
   * Count violations by domain
   */
  countByDomain(domain: ViolationDomain): Promise<number>;

  /**
   * Delete violation (for admin/cleanup only)
   */
  delete(id: string): Promise<void>;
}
