"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { RAIL_ITEMS, isRailActive, UserAvatar } from "@/component/nav/SideNav";

/** Bottom tab bar for signed-in members on small screens (mirrors the side rail). */
const MobileTabBar = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  if (!user) return null;

  const items = [...RAIL_ITEMS, { label: "Profile", href: "/profile", icon: null }];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch justify-around bg-[var(--background)] lg:hidden">
      {items.map(({ label, href, icon: Icon }) => {
        const active = isRailActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[0.65rem] font-medium"
            style={{ color: active ? "var(--accent-2)" : "var(--muted)" }}
          >
            {Icon ? <Icon className="h-5 w-5" /> : <UserAvatar size={22} />}
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileTabBar;
