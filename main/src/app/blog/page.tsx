"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/component/nav/AppShell";
import Markdown from "@/component/ui/Markdown";
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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    blogsApi
      .list()
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Default to the newest post once the list has loaded.
  useEffect(() => {
    if (!selectedId && posts.length > 0) {
      setSelectedId(posts[0].id);
    }
  }, [posts, selectedId]);

  const selected = useMemo(
    () => posts.find((p) => p.id === selectedId) ?? null,
    [posts, selectedId]
  );

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-16 md:py-20">
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
          <div className="mt-10 flex flex-col gap-8 lg:flex-row">
            {/* Sidebar — post list */}
            <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:h-fit lg:w-[320px]">
              <ul className="flex flex-col gap-2">
                {posts.map((p) => {
                  const isActive = p.id === selectedId;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(p.id)}
                        className="w-full rounded-xl border p-4 text-left transition-colors"
                        style={{
                          borderColor: isActive
                            ? "var(--accent)"
                            : "var(--border)",
                          background: isActive
                            ? "color-mix(in srgb, var(--accent) 8%, var(--background))"
                            : "var(--surface)",
                        }}
                      >
                        <p className="text-[0.72rem] text-[var(--muted)]">
                          {formatDate(p.createdAt)}
                        </p>
                        <span className="mt-1 block font-semibold">
                          {p.title}
                        </span>
                        <p className="mt-1 line-clamp-2 text-[0.8rem] text-[var(--muted)]">
                          {p.content}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            {/* Detail — full post content */}
            <section className="min-w-0 flex-1">
              {selected ? (
                <article key={selected.id}>
                  <p className="text-[0.8rem] text-[var(--muted)]">
                    {formatDate(selected.createdAt)}
                  </p>
                  <h2 className="g-heading-lg mt-2 !text-2xl md:!text-3xl">
                    {selected.title}
                  </h2>
                  {selected.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {selected.tags.map((t) => (
                        <span key={t} className="g-chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <Markdown className="g-body mt-6">{selected.content}</Markdown>
                  {selected.links.length > 0 && (
                    <div className="mt-8 border-t border-[var(--border)] pt-5">
                      <h3 className="g-heading-sm mb-2 text-sm">Links</h3>
                      <ul className="flex flex-col gap-1">
                        {selected.links.map((l) => (
                          <li key={l}>
                            <a
                              href={l}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-all text-[var(--accent)] hover:underline"
                            >
                              {l}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              ) : (
                <p className="g-body">Select a post to read it.</p>
              )}
            </section>
          </div>
        )}
      </main>
    </AppShell>
  );
};

export default BlogListPage;
