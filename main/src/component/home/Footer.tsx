import Link from "next/link";
import {
  FiInstagram,
  FiFacebook,
  FiLinkedin,
  FiTwitter,
} from "react-icons/fi";
import { SiDiscord } from "react-icons/si";

const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/id_here",
    icon: FiInstagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/id_here",
    icon: FiFacebook,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/id_here",
    icon: FiLinkedin,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/id_here",
    icon: FiTwitter,
  },
  {
    name: "Discord",
    href: "https://discord.gg/id_here",
    icon: SiDiscord,
  },
];

const columns = [
  {
    heading: "Program",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "About", href: "/#about" },
      { label: "Projects", href: "/projects" },
      { label: "Founders", href: "/#founders" },
    ],
  },
  {
    heading: "Get started",
    links: [
      { label: "Join the community", href: "/register" },
      { label: "Sign in", href: "/login" },
      { label: "Reset password", href: "/reset-password" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-[rgb(var(--border-rgb))]">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <h2 className="g-heading-sm mb-2">IshvaraX</h2>
            <p className="g-body max-w-xs">
              Uplifting people who love to code — powered by PINAKA.
            </p>
            <div className="mt-5 flex gap-1">
              {socials.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[rgb(var(--muted-rgb))] transition-colors hover:bg-[rgb(var(--surface-rgb))] hover:text-[rgb(var(--foreground-rgb))]"
                  aria-label={name}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <h3 className="g-eyebrow mb-4">{column.heading}</h3>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[0.9rem] text-[rgb(var(--muted-rgb))] transition-colors hover:text-[rgb(var(--foreground-rgb))]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[rgb(var(--border-rgb))] pt-6">
          <span className="g-body text-[0.8rem]">
            © {new Date().getFullYear()} IshvaraX · Proprietary
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;