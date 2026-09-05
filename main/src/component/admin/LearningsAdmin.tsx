"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ApiError,
  learningsApi,
  type LearningDTO,
  type LearningPayload,
} from "@/lib/api";

const empty: LearningPayload = { section: "", category: "", title: "", link: "" };

const DEFAULT_SECTIONS = [
  "Syllabus",
  "Books & Notes",
  "Previous year questions",
  "Video courses",
];

/** Admin CRUD for learning resources (course, category, link). */
const LearningsAdmin = ({ adminPw }: { adminPw: string }) => {
  const [items, setItems] = useState<LearningDTO[]>([]);
  const [form, setForm] = useState<LearningPayload>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    learningsApi.list().then(setItems).catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const reset = () => {
    setForm(empty);
    setEditingId(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload: LearningPayload = {
      section: form.section.trim(),
      category: form.category.trim(),
      title: form.title.trim(),
      link: form.link.trim(),
    };
    setSaving(true);
    try {
      if (editingId) {
        await learningsApi.update(editingId, payload, adminPw);
      } else {
        await learningsApi.create(payload, adminPw);
      }
      reset();
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (it: LearningDTO) => {
    setEditingId(it.id);
    setForm({
      section: it.section,
      category: it.category,
      title: it.title,
      link: it.link,
    });
  };

  const onDelete = async (id: string) => {
    try {
      await learningsApi.remove(id, adminPw);
      if (editingId === id) reset();
      load();
    } catch {
      // ignore
    }
  };

  return (
    <section className="mt-12">
      <h2 className="g-heading-sm mb-4 text-lg">Learnings ({items.length})</h2>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        {/* Form */}
        <form onSubmit={onSubmit} className="g-card h-fit flex flex-col gap-3">
          <h3 className="g-heading-sm">
            {editingId ? "Edit resource" : "Add a resource"}
          </h3>
          <input
            name="section"
            required
            list="learning-sections"
            placeholder="Section (type a new one or pick)"
            value={form.section}
            onChange={onChange}
            className="g-input"
          />
          <datalist id="learning-sections">
            {[...new Set([...DEFAULT_SECTIONS, ...items.map((i) => i.section)])].map(
              (s) => (
                <option key={s} value={s} />
              )
            )}
          </datalist>
          <input
            name="category"
            required
            list="learning-categories"
            placeholder="Category (e.g. SEM I, or a custom one)"
            value={form.category}
            onChange={onChange}
            className="g-input"
          />
          <datalist id="learning-categories">
            {[...new Set(items.map((i) => i.category))].map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <input
            name="title"
            required
            placeholder="Course / subject title"
            value={form.title}
            onChange={onChange}
            className="g-input"
          />
          <input
            name="link"
            required
            placeholder="Resource link (https://…)"
            value={form.link}
            onChange={onChange}
            className="g-input"
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
              {saving ? "Saving…" : editingId ? "Update" : "Add"}
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
          {items.length === 0 && (
            <p className="g-body">No resources yet.</p>
          )}
          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-3"
            >
              <div className="min-w-0">
                <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--muted)]">
                  {it.section} · {it.category}
                </p>
                <p className="font-medium">{it.title}</p>
                <a
                  href={it.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-[0.8rem] text-[var(--accent)] hover:underline"
                >
                  {it.link}
                </a>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(it)}
                  className="g-btn px-3 py-1.5 text-xs"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(it.id)}
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

export default LearningsAdmin;
