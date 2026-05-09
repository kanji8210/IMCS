export const CASE_STATUS = {
  OPEN: "OPEN",
  UNDER_REVIEW: "UNDER_REVIEW",
  RECOMMENDED: "RECOMMENDED",
  CLOSED: "CLOSED",
} as const;

export type CaseStatus = (typeof CASE_STATUS)[keyof typeof CASE_STATUS];
