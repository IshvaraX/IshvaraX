"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdClose,
  MdMenu,
  MdOutlineLogin,
  MdOutlineLogout,
  MdSearch,
} from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { isNavActive, navItemsFor, UserAvatar } from "@/component/nav/SideNav";
import ThemeToggle from "@/component/ui/ThemeToggle";
import content from "@/app/site-content.json";

const { auth, site } = content;

/** Brand mark: two chevrons in primary + tertiary. */
export const BrandMark = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M3 20L12 3l9 17" stroke="var(--md-sys-color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 20l4-8 4 8" stroke="var(--md-sys-color-tertiary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Wordmark = () => (
  <>
    {site.name.replace(/X$/, "")}
    <span className="text-primary">X</span>
  </>
);

/**
 * Small-screen navigation (the rail takes over from `lg`): a top app bar with
 * menu + search, and a modal navigation drawer.
 */
const LearnNav = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close the drawer whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      {/* Desktop top bar: brand only; navigation lives in the rail. Keeps the rail's canvas colour (no scroll tint). */}
      <header className="m3-top-bar hidden lg:ml-[88px] lg:block">
        <div className="flex h-14 items-center px-6">
          <Link href="/" className="m3-title-medium flex items-center gap-2 text-on-surface">
            <BrandMark size={22} />
            <span>
              <Wordmark />
            </span>
          </Link>
        </div>
      </header>

      <header className={`m3-top-bar lg:hidden ${scrolled ? "is-scrolled" : ""}`}>
        <div className="flex h-16 items-center justify-between px-2">
          <div className="flex items-center">
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="m3-icon-btn text-on-surface"
            >
              <MdMenu />
            </button>
            <Link
              href="/"
              className="m3-title-medium ml-1 flex items-center gap-2 px-2 text-on-surface"
            >
              <BrandMark size={20} />
              <span>
                <Wordmark />
              </span>
            </Link>
          </div>
          <Link
            href="/#search"
            aria-label="Search projects"
            className="m3-icon-btn text-on-surface"
          >
            <MdSearch />
          </Link>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="m3-scrim absolute inset-0" onClick={close} />
          <nav className="m3-drawer">
            <div className="mb-2 flex items-center justify-between py-1 pl-4 pr-1">
              <Link
                href="/"
                onClick={close}
                className="m3-title-medium flex items-center gap-2 text-on-surface"
              >
                <BrandMark size={20} />
                <span>
                  <Wordmark />
                </span>
              </Link>
              <button type="button" aria-label="Close menu" onClick={close} className="m3-icon-btn">
                <MdClose />
              </button>
            </div>

            {navItemsFor(!!user).map(({ label, href, icon, activeIcon }) => {
              const active = isNavActive(pathname, href);
              const Icon = active ? activeIcon : icon;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={close}
                  aria-current={active ? "page" : undefined}
                  className={`m3-nav-item ${active ? "is-active" : ""}`}
                >
                  <Icon />
                  {label}
                </Link>
              );
            })}

            <div className="mx-4 my-2 h-px bg-outline-variant" />

            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={close}
                  className={`m3-nav-item ${isNavActive(pathname, "/profile") ? "is-active" : ""}`}
                >
                  <UserAvatar size={20} />
                  Profile · @{user.username}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    close();
                  }}
                  className="m3-nav-item"
                >
                  <MdOutlineLogout />
                  {auth.signOut}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={close} className="m3-nav-item">
                  <MdOutlineLogin />
                  {auth.logIn}
                </Link>
                <div className="px-4 pt-2">
                  <Link href="/register" onClick={close} className="m3-btn m3-btn-filled w-full">
                    {auth.signUp}
                  </Link>
                </div>
              </>
            )}

            <div className="mt-auto flex items-center justify-between px-4 pt-6">
              <span className="m3-label-large text-on-surface-variant">Theme</span>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default LearnNav;
