"use client";

import { useEffect, useState } from "react";
import { RiMenuFold3Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
  const iconSrc = "/IshvaraX/icon.jpg";
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

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
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 72;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { id: "pinaka", label: "Pinaka" },
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
        className={`fixed top-0 z-50 w-full bg-[rgb(var(--background-rgb))] transition-shadow duration-200 ${
          scrolled ? "border-b border-[rgb(var(--border-rgb))]" : "border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 md:px-6">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection("hero")}
          >
            <div className="h-7 w-7 overflow-hidden rounded-full">
              <img
                src={iconSrc}
                alt="IshvaraX Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-[0.95rem] font-medium text-[rgb(var(--foreground-rgb))]">
              IshvaraX
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-[0.875rem] font-medium transition-colors relative py-1 ${
                  activeSection === item.id
                    ? "text-[rgb(var(--foreground-rgb))]"
                    : "text-[rgb(var(--muted-rgb))] hover:text-[rgb(var(--foreground-rgb))]"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute -bottom-[14px] left-0 right-0 h-[2px] bg-[rgb(var(--foreground-rgb))]" />
                )}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[rgb(var(--foreground-rgb))]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <IoMdClose size={22} /> : <RiMenuFold3Line size={22} />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-72 bg-[rgb(var(--background-rgb))] border-l border-[rgb(var(--border-rgb))] p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-[rgb(var(--surface-rgb))]"
              >
                <IoMdClose size={18} />
              </button>
            </div>

            <div className="flex flex-col">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-3 py-3 text-sm font-medium border-b border-[rgb(var(--border-rgb))] transition-colors ${
                    activeSection === item.id
                      ? "text-[rgb(var(--foreground-rgb))]"
                      : "text-[rgb(var(--muted-rgb))]"
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