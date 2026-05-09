import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <section id="overview" className="mx-auto w-full max-w-6xl px-4 pb-14 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <div className="panel-glass p-6 sm:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent-green)]">Government of Kenya Services</p>
          <h1 className="mt-4 max-w-3xl text-balance font-heading text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Immigration Services and Secure Case Management for the Public
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            IMCS supports public information access while enabling secure officer workflows for ETA alerts, document review, recommendations, and notifications.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#public-services"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-linear-to-r from-[color:var(--accent-green)] to-[color:var(--accent-red)] px-5 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent-green)]"
            >
              Public Services
            </a>
            <a
              href="#security"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/25 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent-red)]"
            >
              Security Model
            </a>
          </div>
        </div>
      </section>

      <section id="workflows" className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "ETA Expiry Monitoring",
              body: "Automatic detection of expiring ETA records with auditable outbound notifications.",
            },
            {
              title: "Case Progression",
              body: "Structured transitions from document rejection to under-review and recommendation states.",
            },
            {
              title: "Officer Authorization",
              body: "Role-based controls enforce jurisdiction and assignment-level access decisions.",
            },
          ].map((item) => (
            <article key={item.title} className="panel-glass p-5">
              <h2 className="font-heading text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-200">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="public-services" className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-4 panel-glass p-6 sm:p-8">
          <h2 className="font-heading text-2xl font-semibold text-white">Public Services (Placeholders)</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">
            The following modules are reserved for future public rollout and will be connected to official data pipelines and moderation workflows.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="panel-glass p-5">
            <h3 className="font-heading text-lg font-semibold text-white">Informational Articles</h3>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Placeholder for immigration guides, policy explainers, and updates for applicants and families.
            </p>
            <Link
              href="/public/articles"
              className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[color:var(--accent-green)] px-4 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Open Articles Placeholder
            </Link>
          </article>

          <article className="panel-glass p-5">
            <h3 className="font-heading text-lg font-semibold text-white">Travel Advisories and Security Alerts</h3>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Placeholder for official advisory feeds, regional security notices, and travel condition updates.
            </p>
            <Link
              href="/public/advisories"
              className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[color:var(--accent-green)] px-4 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Open Advisories Placeholder
            </Link>
          </article>

          <article className="panel-glass p-5">
            <h3 className="font-heading text-lg font-semibold text-white">Report Abuse of Immigration Provisions</h3>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Placeholder for confidential reports about misuse by individuals or officers, with triage and audit tracking.
            </p>
            <Link
              href="/public/report-abuse"
              className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[color:var(--accent-red)] px-4 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Report Abuse Placeholder
            </Link>
          </article>

          <article className="panel-glass p-5">
            <h3 className="font-heading text-lg font-semibold text-white">Check Extension Eligibility (Anonymous)</h3>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Placeholder for eligibility checks without requesting a name or passport number.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                disabled
                placeholder="Permit class (e.g. Work, Student)"
                className="min-h-11 rounded-xl border border-white/20 bg-white/10 px-3 text-sm text-slate-100 placeholder:text-slate-400"
              />
              <input
                disabled
                placeholder="Current expiry month"
                className="min-h-11 rounded-xl border border-white/20 bg-white/10 px-3 text-sm text-slate-100 placeholder:text-slate-400"
              />
            </div>
            <Link
              href="/public/extension-eligibility"
              className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-[color:var(--accent-green)] px-4 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Open Eligibility Placeholder
            </Link>
          </article>
        </div>
      </section>

      <section id="security" className="mx-auto w-full max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="panel-glass p-6 sm:p-8">
          <h2 className="font-heading text-2xl font-semibold text-white">Security First</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">
            Every API action is policy-checked, request-context aware, and audit-logged. This foundation supports future SSO integration and stricter environment hardening as deployment scales.
          </p>
        </div>
      </section>
    </div>
  );
}
