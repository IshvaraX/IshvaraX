import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Open projects",
  description:
    "Browse open freelance and community coding projects on IshvaraX. Pick work that matches your skills, apply with your portfolio, and build real software with other developers.",
  path: "/projects",
  keywords: ["open projects", "freelance developer work", "apply to coding projects"],
});

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
