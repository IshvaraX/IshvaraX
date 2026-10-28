import Link from "next/link";
import type { ReactNode } from "react";
import { MdArrowBack } from "react-icons/md";
import AppShell from "@/component/nav/AppShell";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

const AuthShell = ({ title, subtitle, children, footer }: AuthShellProps) => (
  <AppShell>
    <main className="grid min-h-[calc(100dvh-4rem)] w-full place-items-center px-4 py-12 lg:min-h-screen">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="m3-btn m3-btn-text mb-4">
            <MdArrowBack aria-hidden />
            IshvaraX
          </Link>
          <h1 className="m3-headline-large mb-2">{title}</h1>
          <p className="m3-body-large text-on-surface-variant">{subtitle}</p>
        </div>

        <div className="m3-panel p-6 md:p-8">
          {children}
        </div>

        <p className="m3-body-medium mt-6 text-center text-on-surface-variant">{footer}</p>
      </div>
    </main>
  </AppShell>
);

export default AuthShell;
