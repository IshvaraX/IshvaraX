"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "@/component/ui/Reveal";
import { pastelAt, toneStyle } from "@/component/projects/PastelProjectCard";
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

const CourseThumb = ({ link, title }: { link: string; title: string }) => {
  const { videoId } = getYouTube(link);
  if (videoId) {
    return (
      <img
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="m3-label-large rounded-full bg-inverse-surface px-4 py-2 text-inverse-on-surface">
        {isPdf(link) ? "PDF" : "Playlist"}
      </span>
    </div>
  );
};

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

  const tiles: Tile[] = [
    ...courses.map<Tile>((c) => ({ kind: "course", id: c.id, createdAt: c.createdAt, data: c })),
    ...posts.map<Tile>((p) => ({ kind: "post", id: p.id, createdAt: p.createdAt, data: p })),
  ].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <section id="latest" className="pt-16 md:pt-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="m3-section-title">Latest in IshvaraX</h2>
          <p className="m3-body-large mt-3 text-on-surface-variant">
            New videos, study materials and writing from the team.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/learnings" className="m3-btn m3-btn-tonal">
            All videos
          </Link>
          <Link href="/blog" className="m3-btn m3-btn-text">
            All posts
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {tiles.map((t, i) => {
          const tone = pastelAt(i);

          if (t.kind === "course") {
            const c = t.data;
            return (
              <Reveal key={t.id} as="article" delay={i * 50} className="m3-tile is-interactive">
                <div className="m3-tile-media aspect-[16/9]" style={toneStyle(tone)}>
                  <CourseThumb link={c.link} title={c.title} />
                </div>
                <div className="m3-tile-body">
                  <p className="m3-label-large" style={{ color: tone.btn }}>
                    {c.section} · {c.category}
                  </p>
                  <h3 className="m3-tile-title">{c.title}</h3>
                  <Link href="/learnings" className="m3-btn m3-btn-text mt-auto -ml-3 self-start pt-2">
                    Watch now <span aria-hidden>→</span>
                  </Link>
                </div>
              </Reveal>
            );
          }

          const p = t.data;
          return (
            <Reveal key={t.id} as="article" delay={i * 50} className="m3-tile is-interactive">
              <div
                className="m3-tile-media flex min-h-[7rem] items-end p-5"
                style={toneStyle(tone)}
              >
                <span className="m3-label-large">Blog · {formatDate(p.createdAt)}</span>
              </div>
              <div className="m3-tile-body">
                <h3 className="m3-tile-title">{p.title}</h3>
                <p className="m3-tile-desc line-clamp-3">{p.content}</p>
                <Link href={`/blog/${p.id}`} className="m3-btn m3-btn-text mt-auto -ml-3 self-start pt-2">
                  Read more <span aria-hidden>→</span>
                </Link>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};

export default LatestContent;
