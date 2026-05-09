export interface FlagExpiringETACommand {
  windowDays: number;
}

export interface ProcessDocumentRejectionCommand {
  individualId: string;
  assignedOfficerId: string;
  rejectionReason: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface SubmitRecommendationCommand {
  caseId: string;
  summary: string;
}

export interface NotifyIndividualCommand {
  individualId: string;
  message: string;
}
