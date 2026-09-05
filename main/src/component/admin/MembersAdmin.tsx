"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, membersApi, type MemberDTO, type MemberPayload } from "@/lib/api";

const empty: MemberPayload = { name: "", role: "", photo: "" };

/** Admin CRUD for organisation members and their roles. */
const MembersAdmin = ({ adminPw }: { adminPw: string }) => {
  const [items, setItems] = useState<MemberDTO[]>([]);
  const [form, setForm] = useState<MemberPayload>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    membersApi.list().then(setItems).catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setForm((f) => ({ ...f, photo: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setForm(empty);
    setEditingId(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload: MemberPayload = {
      name: form.name.trim(),
      role: form.role.trim(),
      photo: form.photo || null,
    };
    setSaving(true);
    try {
      if (editingId) {
        await membersApi.update(editingId, payload, adminPw);
      } else {
        await membersApi.create(payload, adminPw);
      }
      reset();
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (m: MemberDTO) => {
    setEditingId(m.id);
    setForm({ name: m.name, role: m.role, photo: m.photo ?? "" });
  };

  const onDelete = async (id: string) => {
    try {
      await membersApi.remove(id, adminPw);
      if (editingId === id) reset();
      load();
    } catch {
      // ignore
    }
  };

  return (
    <section className="mt-12">
      <h2 className="g-heading-sm mb-4 text-lg">Members ({items.length})</h2>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        {/* Form */}
        <form onSubmit={onSubmit} className="g-card h-fit flex flex-col gap-3">
          <h3 className="g-heading-sm">
            {editingId ? "Edit member" : "Add a member"}
          </h3>
          <input
            name="name"
            required
            placeholder="Full name"
            value={form.name}
            onChange={onChange}
            className="g-input"
          />
          <input
            name="role"
            required
            placeholder="Role (e.g. Founder, Mentor)"
            value={form.role}
            onChange={onChange}
            className="g-input"
          />
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[var(--muted)]">
              Photo (optional)
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={onPhoto}
              className="g-input text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--foreground)] file:px-3 file:py-1.5 file:text-[var(--background)]"
            />
          </label>
          {form.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.photo}
              alt="Member preview"
              className="h-16 w-16 rounded-full border border-[var(--border)] object-cover"
            />
          )}
          {error && (
            <p className="text-[0.85rem] text-[var(--danger)]" role="alert">
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
          {items.length === 0 && <p className="g-body">No members yet.</p>}
          {items.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-extrabold text-[var(--on-accent)]">
                    {m.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="font-medium">{m.name}</p>
                  <p className="text-[0.8rem] text-[var(--muted)]">{m.role}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(m)}
                  className="g-btn px-3 py-1.5 text-xs"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(m.id)}
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

export default MembersAdmin;
