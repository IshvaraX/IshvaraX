import type { ReactNode } from "react";
import Header from "@/component/nav/Header";

/** App layout: minimal sticky header above the page content. */
const AppShell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen">
    <Header />
    {children}
  </div>
);

export default AppShell;
