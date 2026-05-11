"use client";

import { useState } from "react";

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const NATIONALITIES = [
  "Afghan", "Albanian", "Algerian", "American", "Angolan", "Argentine", "Australian",
  "Austrian", "Bangladeshi", "Belgian", "Bolivian", "Brazilian", "British", "Bulgarian",
  "Cameroonian", "Canadian", "Chilean", "Chinese", "Colombian", "Congolese", "Croatian",
  "Cuban", "Czech", "Danish", "Dutch", "Egyptian", "Eritrean", "Ethiopian", "Finnish",
  "French", "Gambian", "German", "Ghanaian", "Greek", "Guatemalan", "Guinean", "Hungarian",
  "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Ivorian",
  "Jamaican", "Japanese", "Jordanian", "Kenyan", "Korean", "Lebanese", "Libyan", "Malawian",
  "Malaysian", "Malian", "Mauritanian", "Mexican", "Moroccan", "Mozambican", "Namibian",
  "Nigerian", "Norwegian", "Pakistani", "Peruvian", "Philippine", "Polish", "Portuguese",
  "Romanian", "Russian", "Rwandan", "Saudi", "Senegalese", "Sierra Leonean", "Somali",
  "South African", "South Sudanese", "Spanish", "Sri Lankan", "Sudanese", "Swedish",
  "Swiss", "Syrian", "Tanzanian", "Thai", "Tunisian", "Turkish", "Ugandan", "Ukrainian",
  "Uruguayan", "Venezuelan", "Vietnamese", "Yemeni", "Zambian", "Zimbabwean", "Other",
];

const VIOLATION_TYPES = [
  {
    domain: "TEMPORAL — Status & Duration",
    domainKey: "TEMPORAL",
    types: [
      { value: "ETA_OVERSTAY", label: "ETA Overstay", description: "Remaining in Kenya beyond the authorized period" },
      { value: "EXPIRED_PERMIT", label: "Expired Permit", description: "Failure to renew work, study, or residency permit" },
      { value: "BREACH_OF_CONDITIONS", label: "Breach of Conditions", description: "Unauthorized activities under visa type" },
    ],
  },
  {
    domain: "INTEGRITY — Documentary & Identity",
    domainKey: "INTEGRITY",
    types: [
      { value: "DOCUMENT_FORGERY", label: "Document Forgery", description: "Fraudulent immigration documents" },
      { value: "MATERIAL_MISREPRESENTATION", label: "Material Misrepresentation", description: "False declarations on immigration applications" },
      { value: "FAILURE_TO_NOTIFY", label: "Failure to Notify", description: "Non-disclosure of changes in status or circumstances" },
    ],
  },
  {
    domain: "REGULATORY — Compliance & Administrative",
    domainKey: "REGULATORY",
    types: [
      { value: "FAILURE_TO_REGISTER", label: "Failure to Register", description: "Failure to register with immigration authorities" },
      { value: "ILLEGAL_EMPLOYMENT", label: "Illegal Employment", description: "Working without a valid work permit" },
      { value: "ILLEGAL_HIRING", label: "Illegal Hiring", description: "Employer illegally hiring foreign nationals" },
      { value: "DOCUMENT_REJECTION_FOLLOWUP", label: "Document Rejection Follow-up", description: "Non-compliance after document rejection" },
    ],
  },
  {
    domain: "SECURITY — Public Interest & Safety",
    domainKey: "SECURITY",
    types: [
      { value: "PROHIBITED_IMMIGRANT", label: "Prohibited Immigrant", description: "Entry by a person prohibited under immigration law" },
      { value: "CRIMINAL_CONVICTION", label: "Criminal Conviction", description: "Undisclosed criminal history affecting admission" },
      { value: "THREAT_TO_NATIONAL_SECURITY", label: "Threat to National Security", description: "Activities or conduct posing national security risk" },
      {
        value: "SUSPECTED_HUMAN_TRAFFICKING",
        label: "Suspected Human Trafficking",
        description: "Recruitment, transportation, harbouring or receipt of persons by coercion, deception or abuse of power for exploitation",
      },
    ],
  },
];

const SEVERITY_LEVELS = [
  { value: "LOW", label: "Low", description: "Minor administrative non-compliance" },
  { value: "MEDIUM", label: "Medium", description: "Moderate regulatory breach" },
  { value: "HIGH", label: "High", description: "Significant violation warranting prompt review" },
  { value: "CRITICAL", label: "Critical", description: "Serious or urgent security/integrity concern" },
];

type SubjectType = "individual" | "organisation" | "";

interface IndividualSubject {
  fullName: string;
  nationality: string;
  passportNumber: string;
  contactPerson: string;
}

interface OrganisationSubject {
  organisationName: string;
  location: string;
  directorName: string;
  contactPerson: string;
}

interface ReporterDetails {
  reporterCategory: "public" | "law_enforcement";
  fullName: string;
  phoneOrEmail: string;
  relationship: string;
  officerAgencyType: "" | "police" | "immigration" | "state_officer_other";
  officerRankOrTitle: string;
  officerServiceNumber: string;
  officerStationOrUnit: string;
  contactEstablishedWithSubject: "" | "yes" | "no";
  contactEstablishedAt: string;
  otherInstitutionHasReport: boolean;
  otherInstitutionName: string;
  otherInstitutionReference: string;
  custodyStatus: "" | "not_in_custody" | "arrested" | "detained";
  custodySince: string;
  assistanceNeeded: string;
  whistleblowerProtection: boolean;
}

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; violationId: string; routing: RoutingResult; whistleblowerProtected: boolean }
  | { status: "error"; message: string };

interface RoutingResult {
  domain: string;
  priority: string;
  targetAudience: string;
  requiresImmediateEscalation: boolean;
  autoGeneratedAction?: string;
  notificationsSent: number;
}

export default function ReportViolationPage() {
  const [violationType, setViolationType] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [individualId, setIndividualId] = useState("");
  const [subjectType, setSubjectType] = useState<SubjectType>("");
  const [individual, setIndividual] = useState<IndividualSubject>({
    fullName: "", nationality: "", passportNumber: "", contactPerson: "",
  });
  const [organisation, setOrganisation] = useState<OrganisationSubject>({
    organisationName: "", location: "", directorName: "", contactPerson: "",
  });
  const [reporter, setReporter] = useState<ReporterDetails>({
    reporterCategory: "public",
    fullName: "",
    phoneOrEmail: "",
    relationship: "",
    officerAgencyType: "",
    officerRankOrTitle: "",
    officerServiceNumber: "",
    officerStationOrUnit: "",
    contactEstablishedWithSubject: "",
    contactEstablishedAt: "",
    otherInstitutionHasReport: false,
    otherInstitutionName: "",
    otherInstitutionReference: "",
    custodyStatus: "",
    custodySince: "",
    assistanceNeeded: "",
    whistleblowerProtection: false,
  });
  const [showReporter, setShowReporter] = useState(false);
  const [formState, setFormState] = useState<FormState>({ status: "idle" });

  function setRep<K extends keyof ReporterDetails>(key: K, value: ReporterDetails[K]) {
    setReporter((prev) => ({ ...prev, [key]: value }));
  }

  function setInd<K extends keyof IndividualSubject>(key: K, value: string) {
    setIndividual((prev) => ({ ...prev, [key]: value }));
  }
  function setOrg<K extends keyof OrganisationSubject>(key: K, value: string) {
    setOrganisation((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState({ status: "submitting" });

    const subjectPayload =
      subjectType === "individual"
        ? {
            subjectType: "individual",
            subject: {
              fullName: individual.fullName || null,
              nationality: individual.nationality || null,
              passportNumber: individual.passportNumber || null,
              contactPerson: individual.contactPerson || null,
            },
          }
        : subjectType === "organisation"
        ? {
            subjectType: "organisation",
            subject: {
              organisationName: organisation.organisationName || null,
              location: organisation.location || null,
              directorName: organisation.directorName || null,
              contactPerson: organisation.contactPerson || null,
            },
          }
        : {};

    try {
      const res = await fetch("/api/public/report-violation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          violationType,
          severity,
          description,
          individualId: individualId.trim() || null,
          ...subjectPayload,
          reporter: showReporter
            ? {
                reporterCategory: reporter.reporterCategory,
                fullName: reporter.fullName || null,
                phoneOrEmail: reporter.phoneOrEmail || null,
                relationship: reporter.relationship || null,
                officerAgencyType: reporter.officerAgencyType || null,
                officerRankOrTitle: reporter.officerRankOrTitle || null,
                officerServiceNumber: reporter.officerServiceNumber || null,
                officerStationOrUnit: reporter.officerStationOrUnit || null,
                contactEstablishedWithSubject: reporter.contactEstablishedWithSubject || null,
                contactEstablishedAt: reporter.contactEstablishedAt || null,
                otherInstitutionHasReport: reporter.otherInstitutionHasReport,
                otherInstitutionName: reporter.otherInstitutionName || null,
                otherInstitutionReference: reporter.otherInstitutionReference || null,
                custodyStatus: reporter.custodyStatus || null,
                custodySince: reporter.custodySince || null,
                assistanceNeeded: reporter.assistanceNeeded || null,
                whistleblowerProtection: reporter.whistleblowerProtection,
              }
            : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          data?.details?.fieldErrors
            ? Object.entries(data.details.fieldErrors as Record<string, string[]>)
                .map(([f, errs]) => `${f}: ${errs.join(", ")}`)
                .join("; ")
            : data?.message ?? "Submission failed.";
        setFormState({ status: "error", message: msg });
        return;
      }

      setFormState({ status: "success", violationId: data.violationId, routing: data.routing, whistleblowerProtected: showReporter && reporter.whistleblowerProtection });
    } catch {
      setFormState({ status: "error", message: "Network error. Please try again." });
    }
  }

  function reset() {
    setViolationType("");
    setSeverity("");
    setDescription("");
    setIndividualId("");
    setSubjectType("");
    setIndividual({ fullName: "", nationality: "", passportNumber: "", contactPerson: "" });
    setOrganisation({ organisationName: "", location: "", directorName: "", contactPerson: "" });
    setReporter({
      reporterCategory: "public",
      fullName: "",
      phoneOrEmail: "",
      relationship: "",
      officerAgencyType: "",
      officerRankOrTitle: "",
      officerServiceNumber: "",
      officerStationOrUnit: "",
      contactEstablishedWithSubject: "",
      contactEstablishedAt: "",
      otherInstitutionHasReport: false,
      otherInstitutionName: "",
      otherInstitutionReference: "",
      custodyStatus: "",
      custodySince: "",
      assistanceNeeded: "",
      whistleblowerProtection: false,
    });
    setShowReporter(false);
    setFormState({ status: "idle" });
  }

  if (formState.status === "success") {
    return <SuccessPanel violationId={formState.violationId} routing={formState.routing} whistleblowerProtected={formState.whistleblowerProtected} onReset={reset} />;
  }

  const isSubmitting = formState.status === "submitting";

  return (
    <main className="min-h-screen bg-[color:var(--surface-base)] px-4 py-10 text-[color:var(--text-primary)]">
      <div className="mx-auto max-w-2xl">
        {/* Page header */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--text-muted)]">
            <span>Government of Kenya</span>
            <span className="text-white/20">›</span>
            <span>Immigration CMS</span>
            <span className="text-white/20">›</span>
            <span className="text-[color:var(--accent-red)]">Report Violation</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Report an Immigration Violation
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-muted)]">
            Use this form to report an immigration law violation. Reports are automatically
            categorized into legal domains and routed to the appropriate authority.
            Anonymous reports are accepted.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Violation type */}
          <fieldset className="mb-6">
            <legend className="mb-3 block text-sm font-semibold text-white">
              Violation Type <span className="text-[color:var(--accent-red)]">*</span>
            </legend>
            <div className="panel-glass overflow-hidden rounded-lg border border-white/10">
              {VIOLATION_TYPES.map((group, gi) => (
                <div key={group.domainKey} className={gi > 0 ? "border-t border-white/10" : ""}>
                  <div className="border-b border-white/5 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-[color:var(--text-muted)]">
                    {group.domain}
                  </div>
                  {group.types.map((t) => (
                    <label
                      key={t.value}
                      className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition hover:bg-white/5 ${
                        violationType === t.value ? "bg-[color:var(--accent-green)]/10" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="violationType"
                        value={t.value}
                        checked={violationType === t.value}
                        onChange={(e) => setViolationType(e.target.value)}
                        required
                        className="mt-0.5 h-4 w-4 accent-[color:var(--accent-green)]"
                      />
                      <div>
                        <span className="block text-sm font-medium text-white">{t.label}</span>
                        <span className="block text-xs text-[color:var(--text-muted)]">{t.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </fieldset>

          {/* Severity */}
          <fieldset className="mb-6">
            <legend className="mb-3 block text-sm font-semibold text-white">
              Severity Level <span className="text-[color:var(--accent-red)]">*</span>
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SEVERITY_LEVELS.map((s) => (
                <label
                  key={s.value}
                  className={`flex cursor-pointer flex-col gap-1 rounded-lg border px-4 py-3 transition ${
                    severity === s.value
                      ? "border-[color:var(--accent-green)] bg-[color:var(--accent-green)]/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <input
                    type="radio"
                    name="severity"
                    value={s.value}
                    checked={severity === s.value}
                    onChange={(e) => setSeverity(e.target.value)}
                    required
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold text-white">{s.label}</span>
                  <span className="text-[11px] leading-snug text-[color:var(--text-muted)]">{s.description}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="mb-2 block text-sm font-semibold text-white">
              Description <span className="text-[color:var(--accent-red)]">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              minLength={10}
              maxLength={1000}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a factual account of the violation. Include dates, locations, and relevant identifying details where known."
              className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
            />
            <p className="mt-1 text-right text-xs text-[color:var(--text-muted)]">
              {description.length}/1000 characters (minimum 10)
            </p>
          </div>

          {/* Subject of report */}
          <fieldset className="mb-6">
            <legend className="mb-3 block text-sm font-semibold text-white">
              Subject of Report{" "}
              <span className="ml-1 text-xs font-normal text-[color:var(--text-muted)]">(optional)</span>
            </legend>

            {/* Type toggle */}
            <div className="mb-4 flex gap-2">
              {(["individual", "organisation"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSubjectType((prev) => (prev === t ? "" : t))}
                  className={`inline-flex min-h-10 items-center justify-center rounded-lg border px-5 text-sm font-semibold capitalize transition ${
                    subjectType === t
                      ? "border-[color:var(--accent-green)] bg-[color:var(--accent-green)]/10 text-white"
                      : "border-white/15 bg-white/5 text-[color:var(--text-muted)] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {t === "individual" ? "Individual" : "Organisation"}
                </button>
              ))}
            </div>

            {/* Individual fields */}
            {subjectType === "individual" && (
              <div className="panel-glass rounded-lg border border-white/10 p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[color:var(--text-muted)]">
                  Individual Details
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="ind-fullName" className="mb-1.5 block text-xs font-semibold text-white">
                      Full Name
                    </label>
                    <input
                      id="ind-fullName"
                      type="text"
                      autoComplete="off"
                      value={individual.fullName}
                      onChange={(e) => setInd("fullName", e.target.value)}
                      placeholder="As on travel document"
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                    />
                  </div>

                  <div>
                    <label htmlFor="ind-nationality" className="mb-1.5 block text-xs font-semibold text-white">
                      Nationality
                    </label>
                    <select
                      id="ind-nationality"
                      value={individual.nationality}
                      onChange={(e) => setInd("nationality", e.target.value)}
                      className="w-full rounded-lg border border-white/15 bg-[color:var(--surface-deep)] px-3 py-2.5 text-sm text-white focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                    >
                      <option value="">Select nationality</option>
                      {NATIONALITIES.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="ind-passport" className="mb-1.5 block text-xs font-semibold text-white">
                      Passport / Travel Doc Number{" "}
                      <span className="font-normal text-[color:var(--text-muted)]">(if known)</span>
                    </label>
                    <input
                      id="ind-passport"
                      type="text"
                      autoComplete="off"
                      value={individual.passportNumber}
                      onChange={(e) => setInd("passportNumber", e.target.value)}
                      placeholder="e.g. A12345678"
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                    />
                  </div>

                  <div>
                    <label htmlFor="ind-contact" className="mb-1.5 block text-xs font-semibold text-white">
                      Contact Person{" "}
                      <span className="font-normal text-[color:var(--text-muted)]">(if known)</span>
                    </label>
                    <input
                      id="ind-contact"
                      type="text"
                      autoComplete="off"
                      value={individual.contactPerson}
                      onChange={(e) => setInd("contactPerson", e.target.value)}
                      placeholder="Name and/or phone number"
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="ind-sysId" className="mb-1.5 block text-xs font-semibold text-white">
                      Immigration System ID{" "}
                      <span className="font-normal text-[color:var(--text-muted)]">(if known)</span>
                    </label>
                    <input
                      id="ind-sysId"
                      type="text"
                      value={individualId}
                      onChange={(e) => setIndividualId(e.target.value)}
                      placeholder="Internal reference ID from the Immigration CMS"
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Organisation fields */}
            {subjectType === "organisation" && (
              <div className="panel-glass rounded-lg border border-white/10 p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[color:var(--text-muted)]">
                  Organisation Details
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="org-name" className="mb-1.5 block text-xs font-semibold text-white">
                      Organisation Name
                    </label>
                    <input
                      id="org-name"
                      type="text"
                      autoComplete="organization"
                      value={organisation.organisationName}
                      onChange={(e) => setOrg("organisationName", e.target.value)}
                      placeholder="Registered name of the organisation"
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                    />
                  </div>

                  <div>
                    <label htmlFor="org-location" className="mb-1.5 block text-xs font-semibold text-white">
                      Location / Address
                    </label>
                    <input
                      id="org-location"
                      type="text"
                      autoComplete="off"
                      value={organisation.location}
                      onChange={(e) => setOrg("location", e.target.value)}
                      placeholder="Town, county or street address"
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                    />
                  </div>

                  <div>
                    <label htmlFor="org-director" className="mb-1.5 block text-xs font-semibold text-white">
                      Director / Responsible Officer{" "}
                      <span className="font-normal text-[color:var(--text-muted)]">(if known)</span>
                    </label>
                    <input
                      id="org-director"
                      type="text"
                      autoComplete="off"
                      value={organisation.directorName}
                      onChange={(e) => setOrg("directorName", e.target.value)}
                      placeholder="Full name of director"
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="org-contact" className="mb-1.5 block text-xs font-semibold text-white">
                      Contact Person{" "}
                      <span className="font-normal text-[color:var(--text-muted)]">(if known)</span>
                    </label>
                    <input
                      id="org-contact"
                      type="text"
                      autoComplete="off"
                      value={organisation.contactPerson}
                      onChange={(e) => setOrg("contactPerson", e.target.value)}
                      placeholder="Name, role and/or phone number"
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                    />
                  </div>
                </div>
              </div>
            )}
          </fieldset>

          {/* ── Reporter details ─────────────────────────────────────── */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">
                Your Details{" "}
                <span className="ml-1 text-xs font-normal text-[color:var(--text-muted)]">(optional — anonymous reporting is fully accepted)</span>
              </span>
              <button
                type="button"
                onClick={() => setShowReporter((v) => !v)}
                className={`inline-flex min-h-9 items-center justify-center rounded-lg border px-4 text-xs font-semibold transition ${
                  showReporter
                    ? "border-[color:var(--accent-green)] bg-[color:var(--accent-green)]/10 text-white"
                    : "border-white/15 bg-white/5 text-[color:var(--text-muted)] hover:bg-white/10 hover:text-white"
                }`}
              >
                {showReporter ? "Hide" : "Provide My Details"}
              </button>
            </div>

            {showReporter && (
              <div className="panel-glass rounded-lg border border-white/10 p-5">
                <div className="mb-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--text-muted)]">
                    Reporter Category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setRep("reporterCategory", "public")}
                      className={`inline-flex min-h-10 items-center justify-center rounded-lg border px-4 text-xs font-semibold transition ${
                        reporter.reporterCategory === "public"
                          ? "border-[color:var(--accent-green)] bg-[color:var(--accent-green)]/10 text-white"
                          : "border-white/15 bg-white/5 text-[color:var(--text-muted)] hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      Public / Civilian Reporter
                    </button>
                    <button
                      type="button"
                      onClick={() => setRep("reporterCategory", "law_enforcement")}
                      className={`inline-flex min-h-10 items-center justify-center rounded-lg border px-4 text-xs font-semibold transition ${
                        reporter.reporterCategory === "law_enforcement"
                          ? "border-[color:var(--accent-red)] bg-[color:var(--accent-red)]/10 text-white"
                          : "border-white/15 bg-white/5 text-[color:var(--text-muted)] hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      Law Enforcement / State Officer
                    </button>
                  </div>
                </div>

                {/* Whistleblower protection toggle */}
                <label className="mb-5 flex cursor-pointer items-start gap-3 rounded-lg border border-amber-500/25 bg-amber-500/8 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={reporter.whistleblowerProtection}
                    onChange={(e) => setRep("whistleblowerProtection", e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-amber-500"
                  />
                  <div>
                    <span className="block text-sm font-semibold text-amber-300">
                      Request Maximum Whistleblower Protection
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-[color:var(--text-muted)]">
                      Your identity will be classified as <strong className="text-white">strictly confidential</strong>.
                      It will not be disclosed to the subject of the report, shared with any third party, or
                      included in any public record. Access is restricted to senior investigative officers only,
                      in accordance with the Kenya Whistleblower Protection Act and the Immigration &amp; Citizenship Act.
                    </span>
                  </div>
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="rep-name" className="mb-1.5 block text-xs font-semibold text-white">
                      Your Full Name
                    </label>
                    <input
                      id="rep-name"
                      type="text"
                      autoComplete="name"
                      value={reporter.fullName}
                      onChange={(e) => setRep("fullName", e.target.value)}
                      placeholder="As on your national ID or passport"
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                    />
                  </div>

                  <div>
                    <label htmlFor="rep-contact" className="mb-1.5 block text-xs font-semibold text-white">
                      Phone or Email
                    </label>
                    <input
                      id="rep-contact"
                      type="text"
                      autoComplete="email tel"
                      value={reporter.phoneOrEmail}
                      onChange={(e) => setRep("phoneOrEmail", e.target.value)}
                      placeholder="+254 7xx xxx xxx or name@example.com"
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="rep-rel" className="mb-1.5 block text-xs font-semibold text-white">
                      Your Relationship to the Subject
                    </label>
                    <select
                      id="rep-rel"
                      value={reporter.relationship}
                      onChange={(e) => setRep("relationship", e.target.value)}
                      className="w-full rounded-lg border border-white/15 bg-[color:var(--surface-deep)] px-3 py-2.5 text-sm text-white focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                    >
                      <option value="">Select relationship</option>
                      <option value="member_of_public">Member of the Public</option>
                      <option value="employer">Employer / Business Associate</option>
                      <option value="employee">Employee / Co-worker</option>
                      <option value="neighbour">Neighbour / Community Member</option>
                      <option value="family_member">Family Member</option>
                      <option value="law_enforcement">Law Enforcement / Security Officer</option>
                      <option value="immigration_officer">Immigration Officer</option>
                      <option value="ngo_worker">NGO / Social Worker</option>
                      <option value="healthcare_worker">Healthcare Worker</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {reporter.reporterCategory === "law_enforcement" && (
                  <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[color:var(--text-muted)]">
                      Legal Intake for Officers
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="leo-agency" className="mb-1.5 block text-xs font-semibold text-white">
                          Officer Type
                        </label>
                        <select
                          id="leo-agency"
                          value={reporter.officerAgencyType}
                          onChange={(e) => setRep("officerAgencyType", e.target.value as ReporterDetails["officerAgencyType"])}
                          className="w-full rounded-lg border border-white/15 bg-[color:var(--surface-deep)] px-3 py-2.5 text-sm text-white focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                        >
                          <option value="">Select officer type</option>
                          <option value="police">Police Officer</option>
                          <option value="immigration">Immigration Officer</option>
                          <option value="state_officer_other">Other State Officer</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="leo-rank" className="mb-1.5 block text-xs font-semibold text-white">
                          Rank / Title
                        </label>
                        <input
                          id="leo-rank"
                          type="text"
                          value={reporter.officerRankOrTitle}
                          onChange={(e) => setRep("officerRankOrTitle", e.target.value)}
                          placeholder="e.g. Inspector, Assistant Director"
                          className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                        />
                      </div>

                      <div>
                        <label htmlFor="leo-service-number" className="mb-1.5 block text-xs font-semibold text-white">
                          Service / Badge Number
                        </label>
                        <input
                          id="leo-service-number"
                          type="text"
                          value={reporter.officerServiceNumber}
                          onChange={(e) => setRep("officerServiceNumber", e.target.value)}
                          placeholder="Official service identification"
                          className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                        />
                      </div>

                      <div>
                        <label htmlFor="leo-station" className="mb-1.5 block text-xs font-semibold text-white">
                          Station / Unit / Department
                        </label>
                        <input
                          id="leo-station"
                          type="text"
                          value={reporter.officerStationOrUnit}
                          onChange={(e) => setRep("officerStationOrUnit", e.target.value)}
                          placeholder="e.g. DCI Nairobi, JKIA Immigration"
                          className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                        />
                      </div>

                      <div>
                        <label htmlFor="leo-contact-established" className="mb-1.5 block text-xs font-semibold text-white">
                          Contact Established with Subject?
                        </label>
                        <select
                          id="leo-contact-established"
                          value={reporter.contactEstablishedWithSubject}
                          onChange={(e) => setRep("contactEstablishedWithSubject", e.target.value as ReporterDetails["contactEstablishedWithSubject"])}
                          className="w-full rounded-lg border border-white/15 bg-[color:var(--surface-deep)] px-3 py-2.5 text-sm text-white focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="leo-contact-at" className="mb-1.5 block text-xs font-semibold text-white">
                          Time Contact Established (if any)
                        </label>
                        <input
                          id="leo-contact-at"
                          type="datetime-local"
                          value={reporter.contactEstablishedAt}
                          onChange={(e) => setRep("contactEstablishedAt", e.target.value)}
                          className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                        />
                      </div>

                      <div>
                        <label htmlFor="leo-custody-status" className="mb-1.5 block text-xs font-semibold text-white">
                          Subject Custody Status
                        </label>
                        <select
                          id="leo-custody-status"
                          value={reporter.custodyStatus}
                          onChange={(e) => setRep("custodyStatus", e.target.value as ReporterDetails["custodyStatus"])}
                          className="w-full rounded-lg border border-white/15 bg-[color:var(--surface-deep)] px-3 py-2.5 text-sm text-white focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                        >
                          <option value="">Select custody status</option>
                          <option value="not_in_custody">Not in custody</option>
                          <option value="arrested">Arrested</option>
                          <option value="detained">Detained</option>
                        </select>
                      </div>

                      {(reporter.custodyStatus === "arrested" || reporter.custodyStatus === "detained") && (
                        <div>
                          <label htmlFor="leo-custody-since" className="mb-1.5 block text-xs font-semibold text-white">
                            Arrest / Detention Time
                          </label>
                          <input
                            id="leo-custody-since"
                            type="datetime-local"
                            value={reporter.custodySince}
                            onChange={(e) => setRep("custodySince", e.target.value)}
                            className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                          />
                        </div>
                      )}

                      <div className="sm:col-span-2">
                        <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-white">
                          <input
                            type="checkbox"
                            checked={reporter.otherInstitutionHasReport}
                            onChange={(e) => setRep("otherInstitutionHasReport", e.target.checked)}
                            className="h-4 w-4 accent-[color:var(--accent-green)]"
                          />
                          Another institution has already taken this report
                        </label>
                      </div>

                      {reporter.otherInstitutionHasReport && (
                        <>
                          <div>
                            <label htmlFor="leo-other-inst" className="mb-1.5 block text-xs font-semibold text-white">
                              Institution Name
                            </label>
                            <input
                              id="leo-other-inst"
                              type="text"
                              value={reporter.otherInstitutionName}
                              onChange={(e) => setRep("otherInstitutionName", e.target.value)}
                              placeholder="e.g. DCI, NPS, ODPP, Anti-Human Trafficking Unit"
                              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                            />
                          </div>

                          <div>
                            <label htmlFor="leo-other-ref" className="mb-1.5 block text-xs font-semibold text-white">
                              Institution Reference / OB Number
                            </label>
                            <input
                              id="leo-other-ref"
                              type="text"
                              value={reporter.otherInstitutionReference}
                              onChange={(e) => setRep("otherInstitutionReference", e.target.value)}
                              placeholder="Case ref, OB number, incident ID"
                              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                            />
                          </div>
                        </>
                      )}

                      <div className="sm:col-span-2">
                        <label htmlFor="leo-help-needed" className="mb-1.5 block text-xs font-semibold text-white">
                          Assistance Required from Immigration Authorities
                        </label>
                        <textarea
                          id="leo-help-needed"
                          rows={3}
                          value={reporter.assistanceNeeded}
                          onChange={(e) => setRep("assistanceNeeded", e.target.value)}
                          placeholder="State what support is required: legal guidance, verification, detention transfer coordination, witness protection, urgent multi-agency response, etc."
                          className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[color:var(--accent-green)] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-green)]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {reporter.whistleblowerProtection && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                    <span className="mt-0.5 text-amber-400" aria-hidden>&#9888;</span>
                    <p className="text-xs leading-relaxed text-amber-200">
                      <strong>Protection active.</strong> This report will be flagged
                      <strong> CONFIDENTIAL — WHISTLEBLOWER PROTECTED</strong>. Your contact details
                      will be stored in an encrypted, access-controlled record visible only to
                      authorised senior officers conducting the investigation.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error */}
          {formState.status === "error" && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-[color:var(--accent-red)]/30 bg-[color:var(--accent-red)]/10 px-4 py-3 text-sm text-[color:var(--accent-red)]"
            >
              <strong>Submission failed:</strong> {formState.message}
            </div>
          )}

          {/* Disclaimer */}
          <p className="mb-5 text-xs leading-relaxed text-[color:var(--text-muted)]">
            By submitting this form you confirm that the information provided is accurate to the
            best of your knowledge. Filing a false report is an offence under the Kenya Immigration
            and Citizenship Act.
          </p>

          {/* Submit */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting || !violationType || !severity || description.length < 10}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[color:var(--accent-green)] px-6 text-sm font-semibold text-white transition hover:bg-[#177a3f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent-green)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? "Submitting…" : "Submit Report"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/20 bg-transparent px-6 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function SuccessPanel({
  violationId,
  routing,
  onReset,
  whistleblowerProtected,
}: {
  violationId: string;
  routing: RoutingResult;
  onReset: () => void;
  whistleblowerProtected: boolean;
}) {
  const domainColors: Record<string, string> = {
    TEMPORAL: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
    INTEGRITY: "border-orange-500/40 bg-orange-500/10 text-orange-300",
    REGULATORY: "border-blue-500/40 bg-blue-500/10 text-blue-300",
    SECURITY: "border-[color:var(--accent-red)]/40 bg-[color:var(--accent-red)]/10 text-[color:var(--accent-red)]",
  };
  const domainClass = domainColors[routing.domain] ?? "border-white/20 bg-white/5 text-white";

  return (
    <main className="min-h-screen bg-[color:var(--surface-base)] px-4 py-10 text-[color:var(--text-primary)]">
      <div className="mx-auto max-w-2xl">
        {/* Success header */}
        <div className="mb-8 rounded-lg border border-[color:var(--accent-green)]/30 bg-[color:var(--accent-green)]/10 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--accent-green)]">
            Report received
          </p>
          <h2 className="font-heading mt-1 text-xl font-bold text-white">
            Violation Reported Successfully
          </h2>
          <p className="mt-2 font-mono text-xs text-[color:var(--text-muted)]">
            Reference ID: <span className="text-white">{violationId}</span>
          </p>
        </div>

        {/* Whistleblower protection confirmation */}
        {whistleblowerProtected && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-5 py-4">
            <span className="mt-0.5 text-lg text-amber-400" aria-hidden>&#128274;</span>
            <div>
              <p className="text-sm font-semibold text-amber-300">
                Whistleblower Protection Confirmed
              </p>
              <p className="mt-1 text-xs leading-relaxed text-amber-200/80">
                Your identity has been classified as <strong className="text-white">strictly confidential</strong> and
                is protected under the Kenya Whistleblower Protection Act. Your details will not be
                disclosed to the subject of this report or any third party. Access is restricted to
                senior investigative officers only.
              </p>
            </div>
          </div>
        )}

        {/* Routing summary */}
        <div className="mb-8 panel-glass rounded-lg border border-white/10 p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[color:var(--text-muted)]">
            Routing Details
          </h3>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-[color:var(--text-muted)]">Legal Domain</dt>
              <dd className={`mt-1 inline-block rounded border px-2.5 py-0.5 text-xs font-semibold ${domainClass}`}>
                {routing.domain}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[color:var(--text-muted)]">Priority</dt>
              <dd className="mt-1 text-sm font-semibold text-white">{routing.priority}</dd>
            </div>
            <div>
              <dt className="text-xs text-[color:var(--text-muted)]">Assigned To</dt>
              <dd className="mt-1 text-sm font-semibold text-white">{routing.targetAudience}</dd>
            </div>
            <div>
              <dt className="text-xs text-[color:var(--text-muted)]">Escalated</dt>
              <dd className="mt-1 text-sm font-semibold text-white">
                {routing.requiresImmediateEscalation ? "Yes — Immediate" : "No"}
              </dd>
            </div>
            {routing.autoGeneratedAction && (
              <div className="sm:col-span-2">
                <dt className="text-xs text-[color:var(--text-muted)]">Auto-generated Action</dt>
                <dd className="mt-1 text-sm text-white">{routing.autoGeneratedAction}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-[color:var(--text-muted)]">Notifications Sent</dt>
              <dd className="mt-1 text-sm font-semibold text-white">{routing.notificationsSent}</dd>
            </div>
          </dl>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/20 bg-transparent px-6 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
        >
          Submit another report
        </button>
      </div>
    </main>
  );
}
