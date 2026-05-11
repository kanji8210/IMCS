/**
 * ViolationType - Domain Value Object for violation categorization
 * 
 * Defines 4 Legal Domains for violation classification:
 * 1. Temporal: Status & Duration Violations (ETA overstay, expired permits, breach of conditions)
 * 2. Integrity: Documentary & Identity Violations (forgery, misrepresentation, failure to notify)
 * 3. Regulatory: Compliance & Administrative Violations (failure to register, illegal employment)
 * 4. Security: Security & Public Interest Violations (prohibited immigrant, criminal conviction, terrorism)
 */

export enum ViolationDomain {
  TEMPORAL = "TEMPORAL",
  INTEGRITY = "INTEGRITY",
  REGULATORY = "REGULATORY",
  SECURITY = "SECURITY",
}

export enum ViolationType {
  // Domain 1: Temporal (Status & Duration Violations)
  ETA_OVERSTAY = "ETA_OVERSTAY",
  EXPIRED_PERMIT = "EXPIRED_PERMIT",
  BREACH_OF_CONDITIONS = "BREACH_OF_CONDITIONS",

  // Domain 2: Integrity (Documentary & Identity Violations)
  DOCUMENT_FORGERY = "DOCUMENT_FORGERY",
  MATERIAL_MISREPRESENTATION = "MATERIAL_MISREPRESENTATION",
  FAILURE_TO_NOTIFY = "FAILURE_TO_NOTIFY",

  // Domain 3: Regulatory (Compliance & Administrative Violations)
  FAILURE_TO_REGISTER = "FAILURE_TO_REGISTER",
  ILLEGAL_EMPLOYMENT = "ILLEGAL_EMPLOYMENT",
  ILLEGAL_HIRING = "ILLEGAL_HIRING",
  DOCUMENT_REJECTION_FOLLOWUP = "DOCUMENT_REJECTION_FOLLOWUP",

  // Domain 4: Security (Security & Public Interest Violations)
  PROHIBITED_IMMIGRANT = "PROHIBITED_IMMIGRANT",
  CRIMINAL_CONVICTION = "CRIMINAL_CONVICTION",
  THREAT_TO_NATIONAL_SECURITY = "THREAT_TO_NATIONAL_SECURITY",
  SUSPECTED_HUMAN_TRAFFICKING = "SUSPECTED_HUMAN_TRAFFICKING",
}

/**
 * Map ViolationType to its legal domain
 */
export function getViolationDomain(type: ViolationType): ViolationDomain {
  const domainMap: Record<ViolationType, ViolationDomain> = {
    // Temporal
    [ViolationType.ETA_OVERSTAY]: ViolationDomain.TEMPORAL,
    [ViolationType.EXPIRED_PERMIT]: ViolationDomain.TEMPORAL,
    [ViolationType.BREACH_OF_CONDITIONS]: ViolationDomain.TEMPORAL,

    // Integrity
    [ViolationType.DOCUMENT_FORGERY]: ViolationDomain.INTEGRITY,
    [ViolationType.MATERIAL_MISREPRESENTATION]: ViolationDomain.INTEGRITY,
    [ViolationType.FAILURE_TO_NOTIFY]: ViolationDomain.INTEGRITY,

    // Regulatory
    [ViolationType.FAILURE_TO_REGISTER]: ViolationDomain.REGULATORY,
    [ViolationType.ILLEGAL_EMPLOYMENT]: ViolationDomain.REGULATORY,
    [ViolationType.ILLEGAL_HIRING]: ViolationDomain.REGULATORY,
    [ViolationType.DOCUMENT_REJECTION_FOLLOWUP]: ViolationDomain.REGULATORY,

    // Security
    [ViolationType.PROHIBITED_IMMIGRANT]: ViolationDomain.SECURITY,
    [ViolationType.CRIMINAL_CONVICTION]: ViolationDomain.SECURITY,
    [ViolationType.THREAT_TO_NATIONAL_SECURITY]: ViolationDomain.SECURITY,
    [ViolationType.SUSPECTED_HUMAN_TRAFFICKING]: ViolationDomain.SECURITY,
  };

  return domainMap[type];
}

/**
 * Get human-readable label for violation type
 */
export function getViolationTypeLabel(type: ViolationType): string {
  const labels: Record<ViolationType, string> = {
    [ViolationType.ETA_OVERSTAY]: "ETA/Visa Overstay",
    [ViolationType.EXPIRED_PERMIT]: "Expired Permit",
    [ViolationType.BREACH_OF_CONDITIONS]: "Breach of Conditions",

    [ViolationType.DOCUMENT_FORGERY]: "Document Forgery",
    [ViolationType.MATERIAL_MISREPRESENTATION]: "Material Misrepresentation",
    [ViolationType.FAILURE_TO_NOTIFY]: "Failure to Notify",

    [ViolationType.FAILURE_TO_REGISTER]: "Failure to Register",
    [ViolationType.ILLEGAL_EMPLOYMENT]: "Illegal Employment",
    [ViolationType.ILLEGAL_HIRING]: "Illegal Hiring",
    [ViolationType.DOCUMENT_REJECTION_FOLLOWUP]: "Document Rejection Follow-up",

    [ViolationType.PROHIBITED_IMMIGRANT]: "Prohibited Immigrant Status",
    [ViolationType.CRIMINAL_CONVICTION]: "Criminal Conviction",
    [ViolationType.THREAT_TO_NATIONAL_SECURITY]: "Threat to National Security",
    [ViolationType.SUSPECTED_HUMAN_TRAFFICKING]: "Suspected Human Trafficking",
  };

  return labels[type];
}

/**
 * Get human-readable label for domain
 */
export function getDomainLabel(domain: ViolationDomain): string {
  const labels: Record<ViolationDomain, string> = {
    [ViolationDomain.TEMPORAL]: "Status & Duration Violations",
    [ViolationDomain.INTEGRITY]: "Documentary & Identity Violations",
    [ViolationDomain.REGULATORY]: "Compliance & Administrative Violations",
    [ViolationDomain.SECURITY]: "Security & Public Interest Violations",
  };

  return labels[domain];
}
