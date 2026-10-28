"use client";

import { useCallback, useEffect, useState } from "react";
import { MdOutlineDelete } from "react-icons/md";
import {
  ApiError,
  productsApi,
  type ProductDTO,
  type ProductPayload,
  type ProductPlatform,
} from "@/lib/api";

const PLATFORMS: { value: ProductPlatform; label: string }[] = [
  { value: "android", label: "Android" },
  { value: "ios", label: "iOS" },
  { value: "web", label: "Web" },
  { value: "desktop", label: "Desktop" },
];

const empty: ProductPayload = {
  name: "",
  tagline: "",
  link: "",
  icon: "",
  platform: "android",
  featured: true,
};

const MAX_ICON_BYTES = 300_000;

const ProductsAdmin = ({ token }: { token: string }) => {
  const [items, setItems] = useState<ProductDTO[]>([]);
  const [form, setForm] = useState<ProductPayload>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    productsApi.list().then(setItems).catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onIcon = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_ICON_BYTES) {
      setError("Please choose an icon under 300 KB (a 512×512 PNG is plenty).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, icon: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setForm(empty);
    setEditingId(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload: ProductPayload = {
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      link: form.link.trim(),
      icon: form.icon || null,
      platform: form.platform,
      featured: form.featured,
    };
    setSaving(true);
    try {
      if (editingId) {
        await productsApi.update(editingId, payload, token);
      } else {
        await productsApi.create(payload, token);
      }
      reset();
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (p: ProductDTO) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      tagline: p.tagline,
      link: p.link,
      icon: p.icon ?? "",
      platform: p.platform,
      featured: p.featured,
    });
  };

  const onDelete = async (id: string) => {
    try {
      await productsApi.remove(id, token);
      if (editingId === id) reset();
      load();
    } catch {
    }
  };

  const onToggleFeatured = async (p: ProductDTO) => {
    try {
      await productsApi.update(p.id, { ...p, featured: !p.featured }, token);
      load();
    } catch {
    }
  };

  return (
    <section className="mt-12">
      <h2 className="g-heading-sm mb-1 text-lg">Products ({items.length})</h2>
      <p className="m3-body-medium mb-4 text-on-surface-variant">
        Apps and tools built by IshvaraX. Featured products appear in the
        home-page hero.
      </p>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <form onSubmit={onSubmit} className="g-card h-fit flex flex-col gap-3">
          <h3 className="g-heading-sm">
            {editingId ? "Edit product" : "Add a product"}
          </h3>
          <input
            name="name"
            required
            maxLength={80}
            placeholder="Product name (e.g. Fit by IshvaraX)"
            value={form.name}
            onChange={onChange}
            className="g-input"
          />
          <input
            name="tagline"
            required
            maxLength={160}
            placeholder="One-line tagline"
            value={form.tagline}
            onChange={onChange}
            className="g-input"
          />
          <input
            name="link"
            required
            type="url"
            placeholder="Link (Play Store, App Store, website…)"
            value={form.link}
            onChange={onChange}
            className="g-input"
          />
          <select
            name="platform"
            value={form.platform}
            onChange={onChange}
            className="g-input"
          >
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <label className="flex flex-col gap-1.5">
            <span className="m3-label-medium text-on-surface-variant">
              Icon (square, optional)
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={onIcon}
              className="g-input"
            />
          </label>
          {form.icon && (
            <div className="flex items-center gap-3">
              <img
                src={form.icon}
                alt="Icon preview"
                className="h-14 w-14 rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, icon: "" }))}
                className="m3-btn m3-btn-text"
              >
                Remove icon
              </button>
            </div>
          )}
          <label className="m3-body-medium flex items-center gap-3 text-on-surface">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="h-[18px] w-[18px] accent-[var(--md-sys-color-primary)]"
            />
            Show in the home-page hero
          </label>
          {error && (
            <p className="m3-body-small text-error" role="alert">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="m3-btn m3-btn-filled">
              {saving ? "Saving…" : editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button type="button" onClick={reset} className="m3-btn m3-btn-text">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="flex flex-col gap-3">
          {items.length === 0 && <p className="g-body">No products yet.</p>}
          {items.map((p) => (
            <div
              key={p.id}
              className="m3-card-outlined flex items-center justify-between gap-3 p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                {p.icon ? (
                  <img
                    src={p.icon}
                    alt={p.name}
                    className="h-12 w-12 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <span className="m3-avatar h-12 w-12 rounded-xl text-sm">
                    {p.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="m3-title-medium flex flex-wrap items-center gap-2">
                    <span className="truncate">{p.name}</span>
                    <span className="g-badge bg-surface-container-high text-on-surface-variant">
                      {p.platform}
                    </span>
                    {!p.featured && (
                      <span className="g-badge bg-surface-container-high text-on-surface-variant">
                        hidden
                      </span>
                    )}
                  </p>
                  <p className="m3-body-small truncate text-on-surface-variant">
                    {p.tagline}
                  </p>
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="m3-body-small block truncate text-primary hover:underline"
                  >
                    {p.link}
                  </a>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onToggleFeatured(p)}
                  className="m3-btn m3-btn-outlined"
                >
                  {p.featured ? "Hide" : "Feature"}
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(p)}
                  className="m3-btn m3-btn-tonal"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(p.id)}
                  aria-label={`Delete ${p.name}`}
                  className="m3-icon-btn text-error"
                >
                  <MdOutlineDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsAdmin;
