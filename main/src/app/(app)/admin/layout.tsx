import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Admin",
  description: "IshvaraX administration.",
  path: "/admin",
  noIndex: true,
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
