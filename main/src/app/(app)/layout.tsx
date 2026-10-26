import type { ReactNode } from "react";
import AppShell from "@/component/nav/AppShell";

/**
 * Shared shell for every page except the auth screens. Living in a layout means
 * the rail / top bar persist across navigations instead of remounting per page.
 */
const AppLayout = ({ children }: { children: ReactNode }) => <AppShell>{children}</AppShell>;

export default AppLayout;
