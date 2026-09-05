"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/component/nav/AppShell";
import { blogsApi, type BlogDTO } from "@/lib/api";

const formatDate = (ms: number) =>
  new Date(ms).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const BlogListPage = () => {
  const [posts, setPosts] = useState<BlogDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogsApi
      .list()
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <main className="mx-auto max-w-4xl px-4 py-16 md:py-20">
        <span className="text-sm font-bold uppercase tracking-wider text-[var(--accent-2)]">Blog</span>
        <h1 className="g-heading-lg mt-2 !text-3xl md:!text-5xl">
          Writings &amp; updates
        </h1>
        <p className="g-body mt-3 max-w-2xl">
          Notes, tutorials and announcements from the IshvaraX team.
        </p>

        {loading ? (
          <p className="g-body mt-10">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="g-body mt-10">No posts yet.</p>
        ) : (
          <div className="mt-10 flex flex-col gap-4">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.id}`}
                className="g-card block transition-colors hover:border-[var(--accent)]"
              >
                <p className="text-[0.75rem] text-[var(--muted)]">
                  {formatDate(p.createdAt)}
                </p>
                <h2 className="g-heading-sm mt-1 text-xl">{p.title}</h2>
                <p className="g-body mt-2 line-clamp-2 text-[0.9rem]">
                  {p.content}
                </p>
                {p.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="g-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
};

export default BlogListPage;
