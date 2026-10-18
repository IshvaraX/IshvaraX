"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import content from "@/app/site-content.json";

const { nav, auth, site } = content;

/** Minimal sticky top bar: wordmark, section links, and a blocky CTA. */
const Header = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const wordmark = (
    <Link href="/" className="text-lg font-semibold tracking-tight">
      {site.name.replace(/X$/, "")}
      <span className="text-[var(--accent)]">X</span>
    </Link>
  );

  const signUpButton = (
    <Link href="/register" className="g-btn g-btn-primary">
      {auth.signUp}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        {wordmark}

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-5 md:flex">
          {user ? (
            <>
              <span className="text-sm text-[var(--muted)]">
                @{user.username}
              </span>
              <button
                onClick={logout}
                className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                {auth.signOut}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                {auth.logIn}
              </Link>
              {signUpButton}
            </>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-3 md:hidden">
          {!user && signUpButton}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-8 flex-col items-center justify-center gap-1.5"
          >
            <span className="h-0.5 w-6 bg-[var(--foreground)]" />
            <span className="h-0.5 w-6 bg-[var(--foreground)]" />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-[var(--border)] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="text-sm text-[var(--muted)]"
              >
                {n.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="text-left text-sm text-[var(--muted)]"
              >
                {auth.signOut}
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-sm text-[var(--muted)]"
              >
                {auth.logIn}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
