"use client";

import { useEffect, useState } from "react";
import { RiMenuFold3Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
  const iconSrc = "/icon.jpg";
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // For navbar shadow effect
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // For active section detection
      const sections = document.querySelectorAll("section[id]");
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute("id") || "";

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Navbar height offset
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { id: "pinaka", label: "PINAKA" },
    { id: "core_mission", label: "Mission" },
    { id: "technology", label: "Technology" },
    { id: "janseva", label: "Jan-Seva" },
    { id: "research", label: "Research" },
    { id: "ethics", label: "Ethics" },
    { id: "founders", label: "Founders" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full border-b-2 transition-all duration-200 ${
          scrolled
            ? "border-zinc-900 dark:border-white bg-white dark:bg-zinc-900"
            : "border-zinc-900 dark:border-white bg-white dark:bg-[rgb(var(--background-rgb))]"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group border-2 border-zinc-900 dark:border-white p-2"
            onClick={() => scrollToSection("hero")}
          >
            <div className="h-9 w-9 overflow-hidden border border-zinc-900 dark:border-white p-1">
              <img
                src={iconSrc}
                alt="IshvaraX Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-bold text-zinc-900 dark:text-white text-sm md:text-base tracking-widest uppercase">
              IshvaraX
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-0 md:flex border-2 border-zinc-900 dark:border-white">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 transition-all text-xs font-bold uppercase tracking-widest border-r-2 border-zinc-900 dark:border-white last:border-r-0 ${
                  activeSection === item.id
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                    : "text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-zinc-900 dark:text-white border-2 border-zinc-900 dark:border-white font-bold"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <IoMdClose size={24} />
            ) : (
              <RiMenuFold3Line size={24} />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-64 bg-white dark:bg-zinc-900 border-l-2 border-zinc-900 dark:border-white">
            <div className="p-4 border-b-2 border-zinc-900 dark:border-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 border-2 border-zinc-900 dark:border-white p-2">
                  <div className="h-8 w-8 overflow-hidden border border-zinc-900 dark:border-white">
                    <img
                      src={iconSrc}
                      alt="IshvaraX Logo"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-widest">
                    IshvaraX
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-zinc-900 dark:text-white border-2 border-zinc-900 dark:border-white font-bold"
                >
                  <IoMdClose size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-0 p-0">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-4 py-3 transition-colors text-xs font-bold uppercase tracking-widest border-b border-zinc-900 dark:border-white ${
                    activeSection === item.id
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                      : "text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
