import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Log in",
  description: "Log in to your IshvaraX account to apply to projects and access study materials.",
  path: "/login",
  noIndex: true,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
