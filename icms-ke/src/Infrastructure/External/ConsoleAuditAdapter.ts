import { AuditPort } from "@/Domain/Services/Ports";

export class ConsoleAuditAdapter implements AuditPort {
  async write(event: {
    actorId: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: Record<string, string | number | boolean>;
    occurredAt: Date;
  }): Promise<void> {
    console.log("AUDIT", event);
  }
}
