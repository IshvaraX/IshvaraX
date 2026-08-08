"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiMenuFold3Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { useAuth } from "@/context/AuthContext";

const sectionLinks = [
  { id: "about", label: "About" },
  { id: "how-it-works", label: "How it works" },
  { id: "opportunities", label: "Opportunities" },
  { id: "pinaka", label: "PINAKA" },
  { id: "founders", label: "Founders" },
];

const routeLinks = [{ href: "/projects", label: "Projects" }];

const linkBase =
  "rounded-xl px-3 py-2.5 text-[0.9rem] font-medium transition-colors";
const linkIdle =
  "text-[rgb(var(--muted-rgb))] hover:bg-[rgb(var(--surface-rgb))] hover:text-[rgb(var(--foreground-rgb))]";
const linkActive =
  "bg-[rgb(var(--surface-rgb))] text-[rgb(var(--foreground-rgb))]";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const close = () => setOpen(false);

  // Scroll-spy: highlight the section currently in view (home only).
  useEffect(() => {
    if (pathname !== "/") {
      setActiveId("");
      return;
    }
    const onScroll = () => {
      const y = window.scrollY + 140;
      let current = "";
      for (const { id } of sectionLinks) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) current = id;
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Reliable smooth-scroll for same-page section links (App Router hash
  // navigation can be flaky, so scroll manually when already on home).
  const onSectionClick = (e: React.MouseEvent, id: string) => {
    close();
    if (pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `/#${id}`);
        setActiveId(id);
      }
    }
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[rgb(var(--border-rgb))] bg-[rgb(var(--background-rgb))] px-4 md:hidden">
        <Link
          href="/"
          className="text-[0.95rem] font-medium tracking-tight"
          onClick={close}
        >
          IshvaraX
        </Link>
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-2 text-[rgb(var(--foreground-rgb))]"
          aria-label="Toggle menu"
        >
          {open ? <IoMdClose size={22} /> : <RiMenuFold3Line size={22} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-[rgb(var(--border-rgb))] bg-[rgb(var(--background-rgb))] px-4 py-6 transition-transform duration-200 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-[1.05rem] font-medium tracking-tight"
            onClick={close}
          >
            IshvaraX
          </Link>
          <button
            onClick={close}
            className="p-1.5 text-[rgb(var(--muted-rgb))] md:hidden"
            aria-label="Close menu"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {sectionLinks.map((link) => (
            <Link
              key={link.id}
              href={`/#${link.id}`}
              onClick={(e) => onSectionClick(e, link.id)}
              className={`${linkBase} ${
                activeId === link.id ? linkActive : linkIdle
              }`}
            >
              {link.label}
            </Link>
          ))}
          {routeLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className={`${linkBase} ${
                pathname === link.href ? linkActive : linkIdle
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-4 flex flex-col gap-2 border-t border-[rgb(var(--border-rgb))] pt-4">
          {user ? (
            <>
              <span className="px-3 text-[0.8rem] text-[rgb(var(--muted-rgb))]">
                Signed in as @{user.username}
              </span>
              <button
                onClick={() => {
                  logout();
                  close();
                }}
                className="g-btn w-full"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={close} className="g-btn w-full">
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={close}
                className="g-btn g-btn-primary w-full"
              >
                Join
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
