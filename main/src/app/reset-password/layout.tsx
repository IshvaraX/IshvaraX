import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Reset password",
  description: "Reset the password for your IshvaraX account.",
  path: "/reset-password",
  noIndex: true,
});

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
