"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import content from "@/app/site-content.json";

const { nav, auth, site } = content;

const links = [{ label: "Home", href: "/" }, ...nav];

/** Minimal top navigation bar with inline links. */
const LearnNav = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : href.startsWith("/") && !href.includes("#")
      ? pathname === href || pathname.startsWith(`${href}/`)
      : false;

  const Auth = ({ onNavigate }: { onNavigate?: () => void }) =>
    user ? (
      <>
        <Link
          href="/profile"
          onClick={onNavigate}
          aria-label="Your profile"
          title={`@${user.username}`}
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] transition-colors hover:border-[var(--accent)]"
        >
          {typeof user.photo === "string" && user.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photo}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-[var(--accent)] text-sm font-extrabold text-[var(--on-accent)]">
              {user.username.charAt(0).toUpperCase()}
            </span>
          )}
        </Link>
        <button
          onClick={() => {
            logout();
            onNavigate?.();
          }}
          className="text-sm font-medium text-[var(--muted)] hover:text-[var(--accent-2)]"
        >
          {auth.signOut}
        </button>
      </>
    ) : (
      <>
        <Link
          href="/login"
          onClick={onNavigate}
          className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent-2)]"
        >
          {auth.logIn}
        </Link>
        <Link
          href="/register"
          onClick={onNavigate}
          className="g-btn g-btn-primary px-4 py-2 text-xs"
        >
          {auth.signUp}
        </Link>
      </>
    );

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="text-lg font-extrabold tracking-tight">
          {site.name.replace(/X$/, "")}
          <span className="text-[var(--accent-2)]">X</span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors hover:text-[var(--accent-2)] ${
                isActive(l.href)
                  ? "text-[var(--accent-2)]"
                  : "text-[var(--foreground)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden items-center gap-3 md:flex">
          <Auth />
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--foreground)] transition-colors hover:bg-[var(--surface)] md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-[0.95rem] font-medium transition-colors ${
                  isActive(l.href)
                    ? "bg-[var(--accent)] text-[var(--on-accent)]"
                    : "text-[var(--foreground)] hover:bg-[var(--surface)]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex items-center gap-3 border-t border-[var(--border)] pt-4">
            <Auth onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default LearnNav;
