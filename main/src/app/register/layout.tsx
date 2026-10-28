import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Join IshvaraX",
  description:
    "Create a free IshvaraX account to join a community of people who love to code — apply to real projects, learn with curated materials, and build together.",
  path: "/register",
  keywords: ["join coding community", "sign up developer community", "create account"],
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
