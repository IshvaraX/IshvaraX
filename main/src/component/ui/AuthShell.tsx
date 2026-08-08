import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

/** Centered card layout shared by the login and register pages. */
const AuthShell = ({ title, subtitle, children, footer }: AuthShellProps) => (
  <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-[rgb(var(--background-rgb))]">
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <Link href="/" className="gdm-eyebrow inline-block mb-4">
          ← IshvaraX
        </Link>
        <h1 className="gdm-heading-xl text-3xl mb-2">{title}</h1>
        <p className="gdm-body">{subtitle}</p>
      </div>

      <div className="rounded-3xl border border-[rgb(var(--border-rgb))] bg-[rgb(var(--surface-rgb))] p-6 md:p-8">
        {children}
      </div>

      <p className="gdm-body text-center text-[0.85rem] mt-6">{footer}</p>
    </div>
  </main>
);

export default AuthShell;
