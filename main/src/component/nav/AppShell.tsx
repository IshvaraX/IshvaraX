import type { ReactNode } from "react";
import Sidebar from "@/component/nav/Sidebar";

/** App layout with a fixed left sidebar and offset content. */
const AppShell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen">
    <Sidebar />
    <div className="pt-14 md:pt-0 md:pl-64">{children}</div>
  </div>
);

export default AppShell;
