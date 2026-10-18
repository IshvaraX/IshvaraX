"use client";

import type { ReactNode } from "react";
import LearnNav from "@/component/nav/LearnNav";
import SideNav from "@/component/nav/SideNav";

/**
 * m3.material.io-style shell: grey canvas, an 88px navigation rail on the left
 * from `lg` up, and a top app bar + modal drawer on smaller screens.
 */
const AppShell = ({ children }: { children: ReactNode }) => (
  <div className="m3-canvas min-h-screen">
    <LearnNav />
    <SideNav />
    <div className="min-w-0 lg:pl-[88px]">{children}</div>
  </div>
);

export default AppShell;
