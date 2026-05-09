export const API_ROUTES = {
  flagExpiringETA: "POST /api/cases/flag-expiring-eta",
  processDocumentRejection: "POST /api/cases/document-rejection",
  submitRecommendation: "POST /api/cases/recommendations",
  notifyIndividual: "POST /api/cases/notify-individual",
} as const;
