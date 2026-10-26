"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, membersApi, type MemberDTO, type MemberPayload } from "@/lib/api";

const empty: MemberPayload = { name: "", role: "", photo: "" };

/** Admin CRUD for organisation members and their roles. */
const MembersAdmin = ({ token }: { token: string }) => {
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
        await membersApi.update(editingId, payload, token);
      } else {
        await membersApi.create(payload, token);
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
      await membersApi.remove(id, token);
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
            <span className="m3-label-medium text-on-surface-variant">
              Photo (optional)
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={onPhoto}
              className="g-input"
            />
          </label>
          {form.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.photo}
              alt="Member preview"
              className="h-16 w-16 rounded-full object-cover"
            />
          )}
          {error && (
            <p className="m3-body-small text-error" role="alert">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="m3-btn m3-btn-filled"
            >
              {saving ? "Saving…" : editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button type="button" onClick={reset} className="m3-btn m3-btn-text">
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
              className="m3-card-outlined flex items-center justify-between gap-3 p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.photo}
                    alt={m.name}
                    loading="lazy"
                    decoding="async"
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="m3-avatar h-10 w-10 text-xs">
                    {m.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="m3-title-medium">{m.name}</p>
                  <p className="m3-body-small text-on-surface-variant">{m.role}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(m)}
                  className="m3-btn m3-btn-tonal"
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
