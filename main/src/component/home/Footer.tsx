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

const Footer = () => {
  return (
    <div className="px-4 md:px-8 py-10 border-t border-[rgb(var(--border-rgb))]">
      <div className="mx-auto max-w-6xl flex flex-col gap-6 items-center sm:flex-row sm:justify-between">
        <span className="gdm-body text-[0.8rem]">
          © {new Date().getFullYear()} IshvaraX · Proprietary
        </span>

        <div className="flex gap-1">
          {socials.map(({ name, href, icon: Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[rgb(var(--muted-rgb))] hover:text-[rgb(var(--foreground-rgb))] hover:bg-[rgb(var(--surface-rgb))] transition-colors"
              aria-label={name}
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;