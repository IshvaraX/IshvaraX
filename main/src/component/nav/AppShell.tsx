"use client";

import type { ReactNode } from "react";
import LearnNav from "@/component/nav/LearnNav";
import SideNav from "@/component/nav/SideNav";
import MobileTabBar from "@/component/nav/MobileTabBar";
import { useAuth } from "@/context/AuthContext";

/**
 * App layout. Visitors: top nav above content. Signed-in members: top bar,
 * icon rail on the left (desktop) and a bottom tab bar (mobile).
 */
const AppShell = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen">
      <LearnNav />
      {user ? (
        <div className="flex">
          <SideNav />
          <div className="dash min-w-0 flex-1 pb-16 lg:pb-0">{children}</div>
          <MobileTabBar />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default AppShell;
