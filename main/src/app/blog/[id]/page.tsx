"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/component/nav/AppShell";
import Markdown from "@/component/ui/Markdown";
import { ApiError, blogsApi, type BlogDTO } from "@/lib/api";

const formatDate = (ms: number) =>
  new Date(ms).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const BlogPostPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [post, setPost] = useState<BlogDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    blogsApi
      .get(id)
      .then(setPost)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AppShell>
      <main className="mx-auto max-w-3xl px-4 py-16 md:py-20">
        <Link href="/blog" className="g-eyebrow inline-block mb-6">
          ← All posts
        </Link>

        {loading ? (
          <p className="g-body">Loading…</p>
        ) : notFound || !post ? (
          <p className="g-body">This post could not be found.</p>
        ) : (
          <article>
            <p className="text-[0.8rem] text-[var(--muted)]">
              {formatDate(post.createdAt)}
            </p>
            <h1 className="g-heading-lg mt-2 !text-3xl md:!text-4xl">
              {post.title}
            </h1>
            {post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <span key={t} className="g-chip">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <Markdown className="g-body mt-6">{post.content}</Markdown>
            {post.links.length > 0 && (
              <div className="mt-8 border-t border-[var(--border)] pt-5">
                <h2 className="g-heading-sm mb-2 text-sm">Links</h2>
                <ul className="flex flex-col gap-1">
                  {post.links.map((l) => (
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
        )}
      </main>
    </AppShell>
  );
};

export default BlogPostPage;
