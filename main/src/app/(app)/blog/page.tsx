"use client";

import { useEffect, useMemo, useState } from "react";
import PagePanel from "@/component/ui/PagePanel";
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
    <PagePanel>
        <span className="m3-label-large text-primary">Blog</span>
        <h1 className="m3-section-title mt-2">
          Writings &amp; updates
        </h1>
        <p className="m3-body-large mt-3 max-w-2xl text-on-surface-variant">
          Notes, tutorials and announcements from the IshvaraX team.
        </p>

        {loading ? (
          <p className="g-body mt-10">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="g-body mt-10">No posts yet.</p>
        ) : (
          <div className="mt-10 flex flex-col gap-8 lg:flex-row">
            <aside className="w-full shrink-0 lg:sticky lg:top-4 lg:h-fit lg:w-[320px]">
              <ul className="flex flex-col gap-2">
                {posts.map((p) => {
                  const isActive = p.id === selectedId;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setSelectedId(p.id)}
                        className={`m3-list-card ${isActive ? "is-selected" : ""}`}
                      >
                        <p className="m3-label-medium m3-supporting">
                          {formatDate(p.createdAt)}
                        </p>
                        <span className="m3-title-medium mt-1 block">
                          {p.title}
                        </span>
                        <p className="m3-body-medium m3-supporting mt-1 line-clamp-2">
                          {p.content}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            <section className="min-w-0 flex-1">
              {selected ? (
                <article key={selected.id}>
                  <p className="m3-label-medium text-on-surface-variant">
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
                    <div className="mt-8 border-t border-outline-variant pt-5">
                      <h3 className="g-heading-sm mb-2 text-sm">Links</h3>
                      <ul className="flex flex-col gap-1">
                        {selected.links.map((l) => (
                          <li key={l}>
                            <a
                              href={l}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-all text-primary hover:underline"
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
    </PagePanel>
  );
};

export default BlogListPage;
