"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "@/component/ui/Reveal";
import CornerNotch from "@/component/ui/CornerNotch";
import { pastelAt } from "@/component/projects/PastelProjectCard";
import { getYouTube } from "@/lib/youtube";
import { isPdf } from "@/lib/media";
import {
  learningsApi,
  blogsApi,
  type LearningDTO,
  type BlogDTO,
} from "@/lib/api";

const formatDate = (ms: number) =>
  new Date(ms).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

type Tile =
  | { kind: "course"; id: string; createdAt: number; data: LearningDTO }
  | { kind: "post"; id: string; createdAt: number; data: BlogDTO };

const ctaClass =
  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90";

/** Thumbnail block for a course: YouTube poster, PDF badge, or generic link. */
const CourseThumb = ({ link, title }: { link: string; title: string }) => {
  const { videoId } = getYouTube(link);
  if (videoId) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-black/5">
      <span className="rounded-full bg-[var(--foreground)]/90 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--on-foreground)]">
        {isPdf(link) ? "PDF" : "Playlist"}
      </span>
    </div>
  );
};

/** Home section: the newest courses and blog posts as pastel tiles. */
const LatestContent = () => {
  const [courses, setCourses] = useState<LearningDTO[]>([]);
  const [posts, setPosts] = useState<BlogDTO[]>([]);

  useEffect(() => {
    learningsApi
      .list()
      .then((all) =>
        setCourses([...all].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3))
      )
      .catch(() => {});
    blogsApi
      .list()
      .then((all) => setPosts(all.slice(0, 3)))
      .catch(() => {});
  }, []);

  if (courses.length === 0 && posts.length === 0) return null;

  // Interleave courses and posts, newest first.
  const tiles: Tile[] = [
    ...courses.map<Tile>((c) => ({ kind: "course", id: c.id, createdAt: c.createdAt, data: c })),
    ...posts.map<Tile>((p) => ({ kind: "post", id: p.id, createdAt: p.createdAt, data: p })),
  ].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <section
      id="latest"
      className="bg-[var(--background)] px-4 py-20 md:px-8 md:py-32"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              Latest
            </span>
            <h2 className="mt-4 text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-[var(--foreground)]">
              New videos &amp; writing
            </h2>
          </div>
          <div className="flex gap-2">
            <Link href="/learnings" className="g-pill g-pill-primary">
              All videos <span aria-hidden>→</span>
            </Link>
            <Link href="/blog" className="g-pill g-pill-soft">
              All posts <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* Mixed pastel grid */}
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {tiles.map((t, i) => {
            const { bg, btn } = pastelAt(i);
            // Alternate media placement so the grid feels like a collage.
            const mediaRight = i % 2 === 0;

            if (t.kind === "course") {
              const c = t.data;
              return (
                <Reveal
                  key={t.id}
                  as="article"
                  delay={i * 50}
                  className={`relative overflow-hidden rounded-2xl ${
                    mediaRight ? "grid min-h-[17rem] grid-cols-[1fr_1.1fr]" : "flex min-h-[24rem] flex-col"
                  }`}
                  style={{ background: bg }}
                >
                  {!mediaRight && (
                    <div className="h-64 w-full">
                      <CourseThumb link={c.link} title={c.title} />
                    </div>
                  )}
                  <div className={`flex flex-col p-6 pb-16 ${mediaRight ? "" : "flex-1"}`}>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-widest" style={{ color: btn }}>
                      {c.section} · {c.category}
                    </p>
                    <h3 className="mt-2 text-xl font-medium leading-snug tracking-[-0.01em] text-[#14161c] md:text-2xl">
                      {c.title}
                    </h3>
                  </div>
                  {mediaRight && (
                    <div className="h-full min-h-[17rem]">
                      <CourseThumb link={c.link} title={c.title} />
                    </div>
                  )}
                  <CornerNotch surface={bg} behind="var(--background)" side="left">
                    <Link href="/learnings" className={ctaClass} style={{ background: btn }}>
                      Watch now <span aria-hidden>→</span>
                    </Link>
                  </CornerNotch>
                </Reveal>
              );
            }

            const p = t.data;
            return (
              <Reveal
                key={t.id}
                as="article"
                delay={i * 50}
                className="relative flex min-h-[17rem] flex-col rounded-2xl p-6 pb-16"
                style={{ background: bg }}
              >
                <p className="text-[0.72rem] font-semibold uppercase tracking-widest" style={{ color: btn }}>
                  Blog · {formatDate(p.createdAt)}
                </p>
                <h3 className="mt-2 text-xl font-medium leading-snug tracking-[-0.01em] text-[#14161c] md:text-2xl">
                  {p.title}
                </h3>
                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-[#14161c]/75">
                  {p.content}
                </p>
                <CornerNotch surface={bg} behind="var(--background)" side="left">
                  <Link href={`/blog/${p.id}`} className={ctaClass} style={{ background: btn }}>
                    Read more <span aria-hidden>→</span>
                  </Link>
                </CornerNotch>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LatestContent;
