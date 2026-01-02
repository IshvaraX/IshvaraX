import Image from "next/image"
import logo from "../../app/icon.png"

const Navbar = () => {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-full">
            {/* Use img tag instead of Next.js Image for static export */}
            <img
              src="/IshvaraX/icon.png"
              alt="IshvaraX Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="font-medium text-black dark:text-white">
            IshvaraX
          </span>
        </div>

        <div className="hidden gap-8 text-sm text-zinc-600 dark:text-zinc-400 md:flex">
          <a href="#mission">Mission</a>
          <a href="#technology">Technology</a>
          <a href="#jan-seva">Jan-Seva</a>
          <a href="#ethics">Ethics</a>
          <a href="#founders">Founders</a>
        </div>
      </nav>
    </header>
  )
}

export default Navbar