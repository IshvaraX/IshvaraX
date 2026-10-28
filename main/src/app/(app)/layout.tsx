import type { ReactNode } from "react";
import AppShell from "@/component/nav/AppShell";

const AppLayout = ({ children }: { children: ReactNode }) => <AppShell>{children}</AppShell>;

export default AppLayout;
