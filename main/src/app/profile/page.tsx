"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/component/nav/AppShell";
import { useAuth } from "@/context/AuthContext";
import { ApiError, projectsApi, type UserApplicationDTO } from "@/lib/api";

const str = (v: unknown) => (typeof v === "string" ? v : "");

/** Edit the signed-in user's profile and profile picture. */
const ProfilePage = () => {
  const { user, isReady, updateProfile } = useAuth();

  const [photo, setPhoto] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState("");
  const [language, setLanguage] = useState("");
  const [upi, setUpi] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [applied, setApplied] = useState<UserApplicationDTO[]>([]);

  // Load the user's applied projects.
  useEffect(() => {
    if (!user) return;
    projectsApi
      .myApplications(user.username)
      .then(setApplied)
      .catch(() => {});
  }, [user]);

  // Prefill once the stored user is available.
  useEffect(() => {
    if (!user) return;
    setPhoto(str(user.photo));
    setEmail(str(user.email));
    setSkills((Array.isArray(user.skills) ? (user.skills as string[]) : []).join(", "));
    setLanguage(str(user.language));
    setUpi(str(user.upi_id));
  }, [user]);

  if (isReady && !user) {
    return (
      <AppShell>
        <main className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="g-heading-lg !text-3xl">Your profile</h1>
          <p className="g-body mt-3">Log in to view and edit your profile.</p>
          <Link href="/login" className="g-btn g-btn-primary mt-6 inline-flex">
            Log in
          </Link>
        </main>
      </AppShell>
    );
  }

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setDone(false);
    setSaving(true);
    try {
      await updateProfile({
        username: user.username,
        password,
        email: email.trim() || undefined,
        photo,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        language: language.trim() || undefined,
        upi_id: upi.trim() || undefined,
        new_password: newPassword || undefined,
      });
      setDone(true);
      setPassword("");
      setNewPassword("");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not save your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <span className="text-sm font-bold uppercase tracking-wider text-[var(--accent-2)]">
              {"// profile"}
        </span>
        <h1 className="g-heading-lg mt-2 !text-3xl">Edit your profile</h1>
        <p className="g-body mt-2">Signed in as @{user?.username}</p>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          {/* Edit form — sidebar */}
          <aside className="h-fit w-full shrink-0 lg:sticky lg:top-24 lg:w-[380px]">

        <form onSubmit={onSubmit} className="g-card flex flex-col gap-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                alt="Profile"
                className="h-20 w-20 rounded-full border border-[var(--border)] object-cover"
              />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent)] text-2xl font-extrabold text-[var(--on-accent)]">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            )}
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-[var(--muted)]">
                Profile picture
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={onPhoto}
                className="g-input text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--foreground)] file:px-3 file:py-1.5 file:text-[var(--background)]"
              />
              {photo && (
                <button
                  type="button"
                  onClick={() => setPhoto("")}
                  className="mt-1 text-left text-xs text-[var(--danger)] hover:underline"
                >
                  Remove photo
                </button>
              )}
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[var(--muted)]">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="g-input"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[var(--muted)]">
              Skills (comma separated)
            </span>
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, Python, Design"
              className="g-input"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-[var(--muted)]">
                Language
              </span>
              <input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="g-input"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-[var(--muted)]">
                UPI ID
              </span>
              <input
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
                className="g-input"
              />
            </label>
          </div>

          <hr className="border-[var(--border)]" />

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[var(--muted)]">
              Current password (required to save)
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="g-input"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[var(--muted)]">
              New password (optional)
            </span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              className="g-input"
            />
          </label>

          {error && (
            <p className="text-[0.85rem] text-[var(--danger)]" role="alert">
              {error}
            </p>
          )}
          {done && (
            <p className="text-[0.85rem] text-[var(--status-open)]">
              ✓ Profile updated.
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="g-btn g-btn-primary disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
        </aside>

        {/* Applied projects — right side */}
        <section className="flex-1">
          <h2 className="g-heading-sm text-lg">
            Applied projects ({applied.length})
          </h2>
          {applied.length === 0 ? (
            <p className="g-body mt-3 text-sm">
              You haven&apos;t applied to any projects yet.{" "}
              <Link href="/#projects" className="text-[var(--accent-2)] hover:underline">
                Browse projects →
              </Link>
            </p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {applied.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold">{a.projectTitle}</span>
                    <span
                      className="rounded-full px-3 py-0.5 text-[0.68rem] font-bold uppercase tracking-widest"
                      style={{
                        background:
                          a.projectStatus === "open"
                            ? "var(--status-open)"
                            : "var(--border)",
                        color:
                          a.projectStatus === "open" ? "#ffffff" : "var(--muted)",
                      }}
                    >
                      {a.projectStatus}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Applied {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                  {a.links && (
                    <p className="mt-1 break-words text-[0.8rem] text-[var(--muted)]">
                      {a.links}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
        </div>
      </main>
    </AppShell>
  );
};

export default ProfilePage;
