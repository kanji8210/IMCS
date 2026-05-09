export const API_ROUTES = {
  flagExpiringETA: "POST /api/cases/flag-expiring-eta",
  processDocumentRejection: "POST /api/cases/document-rejection",
  submitRecommendation: "POST /api/cases/:caseId/recommendations",
} as const;
