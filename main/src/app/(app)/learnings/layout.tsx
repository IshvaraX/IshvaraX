import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Learnings",
  description:
    "Courses, syllabus notes, PDFs and curated video playlists for IshvaraX members — study materials organised by section and category to help you learn to code.",
  path: "/learnings",
  keywords: ["learn programming", "coding courses", "study materials", "video playlists"],
});

export default function LearningsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
