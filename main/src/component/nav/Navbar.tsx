"use client"

import { useEffect, useState } from "react"

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]")
      const scrollPosition = window.scrollY + 100

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop
        const sectionHeight = (section as HTMLElement).offsetHeight
        const sectionId = section.getAttribute("id") || ""

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveSection(sectionId)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80 // Navbar height offset
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      })
    }
  }

  // Get section titles from your JSON or define them here
  const navItems = [
    { id: "pinaka", label: "PINAKA" },
    { id: "core_mission", label: "Mission" },
    { id: "technology", label: "Technology" },
    { id: "janseva", label: "Jan-Seva" },
    { id: "research", label: "Research" },
    { id: "ethics", label: "Ethics" },
    { id: "founders", label: "Founders" }
  ]

  return (
    <header className="fixed top-0 z-50 w-full border-b border-black/10 dark:border-white/10 bg-white/95 dark:bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-black/60">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection("hero")}>
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <img
              src="/IshvaraX/icon.png"
              alt="IshvaraX Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="font-medium text-black dark:text-white text-sm">
            IshvaraX
          </span>
        </div>

        {/* Desktop Navigation - Compact */}
        <div className="hidden items-center gap-4 text-xs md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeSection === item.id
                  ? "bg-black/10 dark:bg-white/10 text-black dark:text-white font-medium"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-black dark:text-white p-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
    </header>
  )
}

export default Navbar