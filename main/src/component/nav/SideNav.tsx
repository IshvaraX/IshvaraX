"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import {
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineNewspaper,
  HiOutlineLogout,
} from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";

type Item = { label: string; href: string; icon: IconType };

export const RAIL_ITEMS: Item[] = [
  { label: "Home", href: "/", icon: HiOutlineHome },
  { label: "Projects", href: "/projects", icon: HiOutlineBriefcase },
  { label: "Learnings", href: "/learnings", icon: HiOutlineAcademicCap },
  { label: "Blog", href: "/blog", icon: HiOutlineNewspaper },
];

export const isRailActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

const RailLink = ({
  href,
  label,
  active,
  children,
}: {
  href: string;
  label: string;
  active: boolean;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="group flex w-full flex-col items-center gap-1 py-2 text-center"
  >
    <span
      className="flex h-9 w-14 items-center justify-center rounded-full transition-colors"
      style={{
        background: active
          ? "color-mix(in srgb, var(--accent) 22%, transparent)"
          : "transparent",
        color: active ? "var(--accent-2)" : "var(--muted)",
      }}
    >
      {children}
    </span>
    <span
      className="text-[0.68rem] font-medium leading-tight"
      style={{ color: active ? "var(--accent-2)" : "var(--muted)" }}
    >
      {label}
    </span>
  </Link>
);

/** Avatar bubble for the signed-in user. */
export const UserAvatar = ({ size = 32 }: { size?: number }) => {
  const { user } = useAuth();
  if (!user) return null;
  return typeof user.photo === "string" && user.photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={user.photo}
      alt=""
      className="rounded-full border border-[var(--border)] object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      className="flex items-center justify-center rounded-full bg-[var(--accent)] text-sm font-extrabold text-[var(--on-accent)]"
      style={{ width: size, height: size }}
    >
      {user.username.charAt(0).toUpperCase()}
    </span>
  );
};

/** Compact icon rail for signed-in members; profile + sign out pinned to the bottom. */
const SideNav = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-20 shrink-0 flex-col items-center bg-[var(--background)] py-3 lg:flex">
      <nav className="flex w-full flex-col items-center gap-1">
        {RAIL_ITEMS.map(({ label, href, icon: Icon }) => (
          <RailLink
            key={href}
            href={href}
            label={label}
            active={isRailActive(pathname, href)}
          >
            <Icon className="h-5 w-5 transition-colors group-hover:text-[var(--foreground)]" />
          </RailLink>
        ))}
      </nav>

      {/* Profile + sign out, pinned to the bottom */}
      <div className="mt-auto flex w-full flex-col items-center gap-1 pt-3">
        <RailLink
          href="/profile"
          label="Profile"
          active={isRailActive(pathname, "/profile")}
        >
          <UserAvatar size={28} />
        </RailLink>
        <button
          type="button"
          onClick={logout}
          className="group flex w-full flex-col items-center gap-1 py-2 text-center"
        >
          <span className="flex h-9 w-14 items-center justify-center rounded-full text-[var(--muted)] transition-colors group-hover:bg-[var(--surface)] group-hover:text-[var(--foreground)]">
            <HiOutlineLogout className="h-5 w-5" />
          </span>
          <span className="text-[0.68rem] font-medium leading-tight text-[var(--muted)]">
            Sign out
          </span>
        </button>
      </div>
    </aside>
  );
};

export default SideNav;
