import Link from "next/link";
import content from "@/app/site-content.json";

const { footer, site } = content;

const Footer = () => {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
        <div className="grid gap-14 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] md:gap-10">
          {/* Brand */}
          <div className="md:pr-6">
            <h2 className="text-3xl font-extrabold tracking-tight">
              {site.name.replace(/X$/, "")}
              <span className="text-[var(--accent-2)]">X</span>
            </h2>
            <p className="mt-4 max-w-xs leading-relaxed text-[var(--muted)]">
              {footer.tagline}
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/register" className="g-btn g-btn-primary px-5 py-2 text-xs">
                Join now
              </Link>
              <Link href="/login" className="g-btn px-5 py-2 text-xs">
                Sign in
              </Link>
            </div>
          </div>

          {/* Link columns */}
          {footer.columns.map((column) => (
            <div key={column.heading}>
              <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-[var(--accent-2)]">
                {column.heading}
              </h3>
              <ul className="flex flex-col gap-3.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[0.95rem] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row sm:items-center">
          <span className="text-[0.85rem] text-[var(--muted)]">
            © {new Date().getFullYear()} {site.name}. Built by the community, for
            the community.
          </span>
          <span className="text-[0.85rem] text-[var(--muted)]">
            PINAKA is a separate, independent research side project.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;