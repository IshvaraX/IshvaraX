"use client";

import { useEffect, useState } from "react";
// import { FaDiceThree, FaWindowClose } from "react-icons/fa";
import { RiMenuFold3Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";


const Navbar = () => {
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
        className={`fixed top-0 z-50 w-full transition-all duration-200 ${
          scrolled
            ? "border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-sm"
            : "border-b border-transparent bg-white/90 dark:bg-[rgb(var(--background-rgb))] backdrop-blur-sm"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => scrollToSection("hero")}
          >
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-zinc-300 dark:border-zinc-700 p-1">
              <img
                src="/IshvaraX/icon.png"
                alt="IshvaraX Logo"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <span className="font-semibold text-zinc-900 dark:text-white text-sm md:text-base tracking-tight">
              IshvaraX
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3 py-2 rounded-lg transition-all text-sm ${
                  activeSection === item.id
                    ? "text-google-blue font-medium bg-google-blue/10"
                    : "text-zinc-700 dark:text-zinc-300 hover:text-google-blue dark:hover:text-google-blue hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-zinc-700 dark:text-zinc-300 hover:text-google-blue dark:hover:text-google-blue transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <RiMenuFold3Line size={24} />
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
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-64 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-zinc-300 dark:border-zinc-700 p-1">
                    <img
                      src="/IshvaraX/icon.png"
                      alt="IshvaraX Logo"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    IshvaraX
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                >
                  <IoMdClose size={20} />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm ${
                      activeSection === item.id
                        ? "text-google-blue font-medium bg-google-blue/10"
                        : "text-zinc-700 dark:text-zinc-300 hover:text-google-blue hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
