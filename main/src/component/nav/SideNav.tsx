"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import {
  MdArticle,
  MdHome,
  MdOutlineArticle,
  MdOutlineHome,
  MdOutlineLogin,
  MdOutlineLogout,
  MdOutlineRocketLaunch,
  MdOutlineSchool,
  MdOutlineWork,
  MdRocketLaunch,
  MdSchool,
  MdSearch,
  MdWork,
} from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/component/ui/ThemeToggle";

export type NavItem = {
  label: string;
  href: string;
  icon: IconType;
  activeIcon: IconType;
  /** Onboarding destinations are hidden once signed in. */
  visitorOnly?: boolean;
};

// Outlined icon at rest, filled icon when the destination is active (M3 convention).
export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: MdOutlineHome, activeIcon: MdHome },
  { label: "Get started", href: "/#roadmap", icon: MdOutlineRocketLaunch, activeIcon: MdRocketLaunch, visitorOnly: true },
  { label: "Projects", href: "/projects", icon: MdOutlineWork, activeIcon: MdWork },
  { label: "Learnings", href: "/learnings", icon: MdOutlineSchool, activeIcon: MdSchool },
  { label: "Blog", href: "/blog", icon: MdOutlineArticle, activeIcon: MdArticle },
];

export const navItemsFor = (signedIn: boolean) =>
  NAV_ITEMS.filter((item) => !item.visitorOnly || !signedIn);

export const isNavActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href);

type RailItemProps = {
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
};

/** Rail destination: icon in a 56×32 pill indicator with the label beneath. */
const RailItem = ({ label, active = false, href, onClick, children }: RailItemProps) => {
  const className = `m3-rail-item ${active ? "is-active" : ""}`;
  const inner = (
    <>
      <span className="m3-rail-indicator">{children}</span>
      <span>{label}</span>
    </>
  );
  return href ? (
    <Link href={href} className={className} aria-current={active ? "page" : undefined}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {inner}
    </button>
  );
};

/** Avatar bubble for the signed-in user (primary-container when no photo). */
export const UserAvatar = ({ size = 32 }: { size?: number }) => {
  const { user } = useAuth();
  if (!user) return null;
  return typeof user.photo === "string" && user.photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={user.photo}
      alt=""
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <span className="m3-avatar text-sm" style={{ width: size, height: size }}>
      {user.username.charAt(0).toUpperCase()}
    </span>
  );
};

/** Desktop navigation rail (m3.material.io style): search on top, theme toggle at the bottom. */
const SideNav = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="m3-rail hidden lg:flex" aria-label="Main">
      <Link
        href="/#search"
        aria-label="Search projects"
        className="m3-icon-btn mb-4 mt-1 h-14 w-14 rounded-2xl bg-tertiary-container text-on-tertiary-container"
      >
        <MdSearch />
      </Link>

      <nav className="flex flex-col items-center gap-1">
        {navItemsFor(!!user).map(({ label, href, icon, activeIcon }) => {
          const active = isNavActive(pathname, href);
          const Icon = active ? activeIcon : icon;
          return (
            <RailItem key={href} href={href} label={label} active={active}>
              <Icon />
            </RailItem>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-2 pt-6">
        {user ? (
          <>
            <RailItem href="/profile" label="Profile" active={isNavActive(pathname, "/profile")}>
              <UserAvatar size={24} />
            </RailItem>
            <RailItem label="Sign out" onClick={logout}>
              <MdOutlineLogout />
            </RailItem>
          </>
        ) : (
          <RailItem href="/login" label="Sign in" active={isNavActive(pathname, "/login")}>
            <MdOutlineLogin />
          </RailItem>
        )}
        <ThemeToggle className="mt-2" />
      </div>
    </aside>
  );
};

export default SideNav;
