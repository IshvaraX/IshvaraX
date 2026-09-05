import type { ReactNode } from "react";
import LearnNav from "@/component/nav/LearnNav";

/** App layout: minimal top nav above the page content. */
const AppShell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen">
    <LearnNav />
    {children}
  </div>
);

export default AppShell;
