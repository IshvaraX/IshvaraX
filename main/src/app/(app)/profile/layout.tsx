import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Your profile",
  description: "Manage your IshvaraX profile, skills and project applications.",
  path: "/profile",
  noIndex: true,
});

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
