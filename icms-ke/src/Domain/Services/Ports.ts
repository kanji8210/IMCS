export interface SecurityContext {
  actorId: string;
  role: "OFFICER" | "SUPERVISOR" | "ADMIN";
  jurisdiction: string;
}

export interface PolicyService {
  canExecute(action: string, context: SecurityContext, resourceOwnerId?: string): boolean;
}

export interface NotificationPort {
  sendSMS(input: { to: string; message: string }): Promise<void>;
}

export interface AuditPort {
  write(event: {
    actorId: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: Record<string, string | number | boolean>;
    occurredAt: Date;
  }): Promise<void>;
}

export interface ClockPort {
  now(): Date;
}
