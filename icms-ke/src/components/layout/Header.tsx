import Link from "next/link";

const navItems = [
  { href: "#overview", label: "Overview" },
  { href: "#workflows", label: "Workflows" },
  { href: "#public-services", label: "Public Services" },
  { href: "#security", label: "Security" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[color:var(--surface-glass)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 py-1 text-[15px] font-semibold tracking-wide text-white transition hover:text-[color:var(--accent-green)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent-red)]"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--accent-green)] text-[13px] font-black text-white">
            IM
          </span>
          <span>Immigration CMS</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent-red)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/public/report-violation"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[color:var(--accent-red)] px-4 text-sm font-semibold text-white transition hover:bg-[#a01226] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent-red)]"
          >
            Report Violation
          </Link>
          <Link
            href="#public-services"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[color:var(--accent-green)] px-4 text-sm font-semibold text-white transition hover:bg-[#177a3f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent-green)]"
          >
            Public Services
          </Link>
        </div>

        <details className="group relative md:hidden">
          <summary className="inline-flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-white/20 bg-white/5 px-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent-red)]">
            Menu
          </summary>

          <nav
            aria-label="Mobile Primary"
            className="absolute right-0 mt-2 w-64 rounded-xl border border-white/15 bg-[color:var(--surface-deep)]/95 p-2 shadow-2xl backdrop-blur"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 w-full items-center rounded-lg px-3 text-sm font-medium text-slate-100 transition hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/public/report-violation"
              className="mt-1 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[color:var(--accent-red)] px-3 text-sm font-semibold text-white transition hover:bg-[#a01226]"
            >
              Report Violation
            </Link>
            <Link
              href="#public-services"
              className="mt-1 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[color:var(--accent-green)] px-3 text-sm font-semibold text-white transition hover:bg-[#177a3f]"
            >
              Public Services
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
