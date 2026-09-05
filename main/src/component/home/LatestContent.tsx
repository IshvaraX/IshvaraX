"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "@/component/ui/Reveal";
import CourseMedia from "@/component/ui/CourseMedia";
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

/** Home section: the newest courses and blog posts added by the admin. */
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

  return (
    <section
      id="latest"
      className="border-t border-[var(--border)] px-4 py-20 md:px-8 md:py-32"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-2">
        {/* Latest courses */}
        <div>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-[var(--accent-2)]">
                {"// latest courses"}
              </span>
              <h2 className="g-heading-lg mt-2 !text-2xl md:!text-3xl">
                Fresh study material
              </h2>
            </div>
            <Link href="/learnings" className="g-btn px-4 py-2 text-xs">
              View all
            </Link>
          </div>

          {courses.length === 0 ? (
            <p className="g-body">No courses yet.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {courses.map((c) => (
                <Reveal
                  as="li"
                  key={c.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
                >
                  <p className="text-[0.7rem] font-bold uppercase tracking-widest text-[var(--muted)]">
                    {c.section} · {c.category}
                  </p>
                  <p className="mb-3 mt-1 font-semibold">{c.title}</p>
                  <CourseMedia link={c.link} title={c.title} />
                </Reveal>
              ))}
            </ul>
          )}
        </div>

        {/* Latest blog posts */}
        <div>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-[var(--accent-2)]">
                {"// latest posts"}
              </span>
              <h2 className="g-heading-lg mt-2 !text-2xl md:!text-3xl">
                From the blog
              </h2>
            </div>
            <Link href="/blog" className="g-btn px-4 py-2 text-xs">
              View all
            </Link>
          </div>

          {posts.length === 0 ? (
            <p className="g-body">No posts yet.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {posts.map((p) => (
                <Reveal
                  as="li"
                  key={p.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
                >
                  <p className="text-[0.7rem] text-[var(--muted)]">
                    {formatDate(p.createdAt)}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 line-clamp-[6] whitespace-pre-wrap text-[0.9rem] leading-relaxed text-[var(--muted)]">
                    {p.content}
                  </p>
                  <Link
                    href={`/blog/${p.id}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-2)] hover:underline"
                  >
                    Read more <span aria-hidden>→</span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestContent;
