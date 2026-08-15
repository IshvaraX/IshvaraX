import Link from "next/link";
import content from "@/app/site-content.json";

const { footer, site } = content;

const Footer = () => {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {site.name.replace(/X$/, "")}
              <span className="text-[var(--accent)]">X</span>
            </h2>
            <p className="mt-2 max-w-xs text-[var(--muted)]">{footer.tagline}</p>
          </div>

          {footer.columns.map((column) => (
            <div key={column.heading}>
              <h3 className="g-eyebrow mb-4">{column.heading}</h3>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[0.9rem] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[var(--border)] pt-6">
          <span className="text-[0.8rem] text-[var(--muted)]">
            © {new Date().getFullYear()} {site.name}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;