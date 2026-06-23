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
    <footer className="px-8 py-12 border-t-2 border-zinc-900 dark:border-white">
      <div className="mx-auto max-w-4xl flex flex-col gap-6 items-center sm:flex-row sm:justify-between">
        <div className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white border-2 border-zinc-900 dark:border-white px-4 py-2">
          © {new Date().getFullYear()} IshvaraX · PROPRIETARY
        </div>

        <div className="flex gap-2 border-2 border-zinc-900 dark:border-white p-2">
          {socials.map(({ name, href, icon: Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 dark:text-white hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 p-2 border border-zinc-900 dark:border-white transition font-bold"
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
