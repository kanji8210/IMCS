import { ETARecord } from "@/Domain/Entities/ETARecord";
import { Individual } from "@/Domain/Entities/Individual";

export interface IndividualRepository {
  findById(id: string): Promise<Individual | null>;
  findByExpiringETA(windowDays: number, now: Date): Promise<Array<{ individual: Individual; eta: ETARecord }>>;
}
