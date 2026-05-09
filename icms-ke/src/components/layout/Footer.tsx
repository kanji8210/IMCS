import Link from "next/link";

const quickLinks = [
  { href: "#overview", label: "Platform Overview" },
  { href: "#workflows", label: "Case Workflows" },
  { href: "#public-services", label: "Public Services" },
  { href: "#security", label: "Security Posture" },
  { href: "#contact", label: "Support" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[color:var(--surface-deep)]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <section>
          <h2 className="text-lg font-semibold text-white">Immigration CMS</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
            Enterprise-grade case management for review, recommendation, and secure communication with applicants.
          </p>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--accent-green)]">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-sm text-slate-200 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent-red)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--accent-green)]">Operations</h3>
          <p className="mt-3 text-sm text-slate-300">Nairobi Command Center</p>
          <p className="mt-1 text-sm text-slate-300">support@imcs.go.ke</p>
          <p className="mt-1 text-sm text-slate-300">+254 700 123 456</p>
        </section>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-400 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} IMCS. Built for secure immigration operations.
      </div>
    </footer>
  );
}
