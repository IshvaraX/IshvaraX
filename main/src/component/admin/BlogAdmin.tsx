"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, blogsApi, type BlogDTO, type BlogPayload } from "@/lib/api";

type FormState = {
  title: string;
  content: string;
  tags: string;
  links: string;
};

const empty: FormState = { title: "", content: "", tags: "", links: "" };

const splitList = (raw: string) =>
  raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

/** Admin CRUD for blog posts. */
const BlogAdmin = ({ adminPw }: { adminPw: string }) => {
  const [items, setItems] = useState<BlogDTO[]>([]);
  const [form, setForm] = useState<FormState>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    blogsApi.list().then(setItems).catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const reset = () => {
    setForm(empty);
    setEditingId(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload: BlogPayload = {
      title: form.title.trim(),
      content: form.content.trim(),
      tags: splitList(form.tags),
      links: splitList(form.links),
    };
    setSaving(true);
    try {
      if (editingId) {
        await blogsApi.update(editingId, payload, adminPw);
      } else {
        await blogsApi.create(payload, adminPw);
      }
      reset();
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (b: BlogDTO) => {
    setEditingId(b.id);
    setForm({
      title: b.title,
      content: b.content,
      tags: b.tags.join(", "),
      links: b.links.join("\n"),
    });
  };

  const onDelete = async (id: string) => {
    try {
      await blogsApi.remove(id, adminPw);
      if (editingId === id) reset();
      load();
    } catch {
      // ignore
    }
  };

  return (
    <section className="mt-12">
      <h2 className="g-heading-sm mb-4 text-lg">Blog ({items.length})</h2>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        {/* Form */}
        <form onSubmit={onSubmit} className="g-card h-fit flex flex-col gap-3">
          <h3 className="g-heading-sm">
            {editingId ? "Edit post" : "Write a post"}
          </h3>
          <input
            name="title"
            required
            placeholder="Post title"
            value={form.title}
            onChange={onChange}
            className="g-input"
          />
          <textarea
            name="content"
            required
            placeholder="Content (Markdown supported)"
            value={form.content}
            onChange={onChange}
            rows={8}
            className="g-input resize-y"
          />
          <input
            name="tags"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={onChange}
            className="g-input"
          />
          <textarea
            name="links"
            placeholder="Links (one per line)"
            value={form.links}
            onChange={onChange}
            rows={2}
            className="g-input resize-y"
          />
          {error && (
            <p className="text-[0.85rem] text-red-500" role="alert">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="g-btn g-btn-primary disabled:opacity-60"
            >
              {saving ? "Saving…" : editingId ? "Update" : "Publish"}
            </button>
            {editingId && (
              <button type="button" onClick={reset} className="g-btn">
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* List */}
        <div className="flex flex-col gap-3">
          {items.length === 0 && <p className="g-body">No posts yet.</p>}
          {items.map((b) => (
            <div
              key={b.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-3"
            >
              <div className="min-w-0">
                <p className="font-medium">{b.title}</p>
                <p className="mt-0.5 line-clamp-2 text-[0.8rem] text-[var(--muted)]">
                  {b.content}
                </p>
                {b.tags.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {b.tags.map((t) => (
                      <span key={t} className="g-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(b)}
                  className="g-btn px-3 py-1.5 text-xs"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(b.id)}
                  className="g-btn g-btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogAdmin;
