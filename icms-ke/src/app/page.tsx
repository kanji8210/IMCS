import Link from "next/link";
import { KenyaEntryMap } from "@/components/maps/KenyaEntryMap";

const entryPoints = [
  // International airports
  { name: "JKIA", location: "Nairobi", type: "Air" as const, lat: -1.3192, lng: 36.9278 },
  { name: "Moi International Airport", location: "Mombasa", type: "Air" as const, lat: -4.0348, lng: 39.5942 },
  { name: "Kisumu International Airport", location: "Kisumu", type: "Air" as const, lat: -0.0861, lng: 34.7289 },
  { name: "Eldoret International Airport", location: "Eldoret", type: "Air" as const, lat: 0.4045, lng: 35.2389 },

  // Land entry points
  { name: "Namanga", location: "Kajiado", type: "Land" as const, lat: -2.5523, lng: 36.7908 },
  { name: "Busia", location: "Busia", type: "Land" as const, lat: 0.4652, lng: 34.1012 },
  { name: "Malaba", location: "Busia", type: "Land" as const, lat: 0.6367, lng: 34.2727 },
  { name: "Lunga Lunga", location: "Kwale", type: "Land" as const, lat: -4.5478, lng: 39.1209 },
  { name: "Taveta", location: "Taita-Taveta", type: "Land" as const, lat: -3.3987, lng: 37.6846 },
  { name: "Moyale", location: "Marsabit", type: "Land" as const, lat: 3.5273, lng: 39.0561 },
  { name: "Isebania", location: "Migori", type: "Land" as const, lat: -1.3964, lng: 34.4849 },
  { name: "Liboi", location: "Garissa", type: "Land" as const, lat: 0.3473, lng: 40.8788 },

  // Sea entry points
  { name: "Port of Mombasa", location: "Mombasa", type: "Sea" as const, lat: -4.0435, lng: 39.6682 },
  { name: "Port of Lamu", location: "Lamu", type: "Sea" as const, lat: -2.2717, lng: 40.902 },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <section id="overview" className="mx-auto flex min-h-[calc(100vh-84px)] w-full max-w-6xl items-center px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="panel-glass w-full p-5 sm:p-7 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.12fr_1fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent-green)]">Government of Kenya Services</p>
              <h1 className="mt-3 max-w-3xl text-balance font-heading text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[2.75rem]">
                Immigration Services and Secure Case Management for the Public
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
                IMCS supports safe borders and welcoming entry through monitored checkpoints,
                trusted officer workflows, and secure public reporting pathways.
              </p>
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                <a
                  href="#public-services"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[color:var(--accent-green)] px-5 text-sm font-semibold text-white transition hover:bg-[#177a3f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent-green)]"
                >
                  Public Services
                </a>
                <Link
                  href="/public/report-violation"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[color:var(--accent-red)] px-5 text-sm font-semibold text-white transition hover:bg-[#a01226] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent-red)]"
                >
                  Report a Violation
                </Link>
                <a
                  href="#security"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/25 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
                >
                  Security Model
                </a>
              </div>
            </div>

            <aside className="flex flex-col gap-3 rounded-2xl border border-white/12 bg-[color:var(--surface-deep)]/80 p-4 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-5">
              {/* Panel header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                    Kenya Entry Monitoring Grid
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">Click any marker for checkpoint details</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full border border-[#1f8f4b]/40 bg-[#1f8f4b]/10 px-2.5 py-1 text-[10px] font-semibold text-[#4ade80]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ade80] opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
                  </span>
                  Live
                </span>
              </div>

              {/* Map */}
              <div className="overflow-hidden rounded-xl border border-white/10 bg-[#091527] shadow-inner">
                <KenyaEntryMap entryPoints={entryPoints} />
              </div>

              {/* Stat chips */}
              <div className="grid grid-cols-4 gap-2">
                <div className="flex flex-col items-center rounded-xl border border-white/12 bg-white/5 py-2.5">
                  <span className="text-base font-bold text-white">{entryPoints.length}</span>
                  <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-400">Total</span>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-[#1f8f4b]/30 bg-[#1f8f4b]/10 py-2.5">
                  <span className="text-base font-bold text-[#4ade80]">4</span>
                  <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#4ade80]/70">Air</span>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-[color:var(--accent-red)]/30 bg-[color:var(--accent-red)]/10 py-2.5">
                  <span className="text-base font-bold text-[#f87171]">8</span>
                  <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#f87171]/70">Land</span>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-[#2a7ccf]/30 bg-[#2a7ccf]/10 py-2.5">
                  <span className="text-base font-bold text-[#60a5fa]">2</span>
                  <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#60a5fa]/70">Sea</span>
                </div>
              </div>
            </aside>
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
              className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[color:var(--accent-green)] px-4 text-sm font-semibold text-white transition hover:bg-[#177a3f]"
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
              className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[color:var(--accent-green)] px-4 text-sm font-semibold text-white transition hover:bg-[#177a3f]"
            >
              Open Advisories Placeholder
            </Link>
          </article>

          <article className="panel-glass p-5">
            <h3 className="font-heading text-lg font-semibold text-white">Report an Immigration Violation</h3>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Report violations such as overstaying, document forgery, or illegal employment. Reports are automatically routed to the relevant authority by legal domain.
            </p>
            <Link
              href="/public/report-violation"
              className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[color:var(--accent-red)] px-4 text-sm font-semibold text-white transition hover:bg-[#a01226]"
            >
              Report a Violation
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
              className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-[color:var(--accent-green)] px-4 text-sm font-semibold text-white transition hover:bg-[#177a3f]"
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
