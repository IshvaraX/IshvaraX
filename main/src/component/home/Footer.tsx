import { FiInstagram, FiFacebook, FiLinkedin, FiTwitter } from "react-icons/fi"
import { SiDiscord } from "react-icons/si"

const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/id_here",
    icon: FiInstagram
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/id_here",
    icon: FiFacebook
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/id_here",
    icon: FiLinkedin
  },
  {
    name: "Twitter",
    href: "https://twitter.com/id_here",
    icon: FiTwitter
  },
  {
    name: "Discord",
    href: "https://discord.gg/id_here",
    icon: SiDiscord
  }
]

const Footer = () => {
  return (
    <footer className="px-8 py-12 border-t border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-4xl flex flex-col gap-6 items-center sm:flex-row sm:justify-between">
        <div className="text-sm text-zinc-500">
          © {new Date().getFullYear()} IshvaraX · Proprietary Technology
        </div>

        <div className="flex gap-5">
          {socials.map(({ name, href, icon: Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-black dark:hover:text-white transition"
              aria-label={name}
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
