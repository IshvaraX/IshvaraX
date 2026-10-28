import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Writings, tutorials and announcements from the IshvaraX community — notes on programming, collaboration, and what we are building together.",
  path: "/blog",
  keywords: ["coding blog", "programming tutorials", "developer community updates"],
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
