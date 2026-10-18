"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/component/nav/AppShell";
import PagePanel from "@/component/ui/PagePanel";
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
        <PagePanel narrow className="flex flex-col items-center justify-center text-center">
          <h1 className="m3-headline-large">Your profile</h1>
          <p className="m3-body-large mt-3 text-on-surface-variant">Log in to view and edit your profile.</p>
          <Link href="/login" className="m3-btn m3-btn-filled mt-6">
            Log in
          </Link>
        </PagePanel>
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
      <PagePanel>
        <span className="m3-label-large text-primary">
          Profile
        </span>
        <h1 className="m3-section-title mt-2">Edit your profile</h1>
        <p className="m3-body-large mt-3 text-on-surface-variant">Signed in as @{user?.username}</p>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row">
          {/* Edit form — sidebar */}
          <aside className="h-fit w-full shrink-0 lg:sticky lg:top-4 lg:w-[380px]">

        <form onSubmit={onSubmit} className="g-card flex flex-col gap-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <span className="m3-avatar h-20 w-20 text-2xl">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            )}
            <label className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="m3-label-medium text-on-surface-variant">
                Profile picture
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={onPhoto}
                className="g-input"
              />
              {photo && (
                <button
                  type="button"
                  onClick={() => setPhoto("")}
                  className="m3-label-medium mt-1 text-left text-error hover:underline"
                >
                  Remove photo
                </button>
              )}
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="m3-label-medium text-on-surface-variant">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="g-input"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="m3-label-medium text-on-surface-variant">
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
              <span className="m3-label-medium text-on-surface-variant">
                Language
              </span>
              <input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="g-input"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="m3-label-medium text-on-surface-variant">
                UPI ID
              </span>
              <input
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
                className="g-input"
              />
            </label>
          </div>

          <hr className="border-outline-variant" />

          <label className="flex flex-col gap-1.5">
            <span className="m3-label-medium text-on-surface-variant">
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
            <span className="m3-label-medium text-on-surface-variant">
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
            <p className="m3-body-small text-error" role="alert">
              {error}
            </p>
          )}
          {done && (
            <p className="m3-body-small text-secondary">
              ✓ Profile updated.
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="m3-btn m3-btn-filled"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
        </aside>

        {/* Applied projects — right side */}
        <div className="flex-1">
          <h2 className="m3-title-large">
            Applied projects ({applied.length})
          </h2>
          {applied.length === 0 ? (
            <p className="m3-body-medium mt-3 text-on-surface-variant">
              You haven&apos;t applied to any projects yet.{" "}
              <Link href="/#projects" className="font-medium text-primary hover:underline">
                Browse projects →
              </Link>
            </p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {applied.map((a) => (
                <li
                  key={a.id}
                  className="m3-card-outlined p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="m3-title-medium">{a.projectTitle}</span>
                    <span
                      className={`g-badge ${
                        a.projectStatus === "open" ? "g-badge-open" : "g-badge-closed"
                      }`}
                    >
                      {a.projectStatus}
                    </span>
                  </div>
                  <p className="m3-body-small mt-1 text-on-surface-variant">
                    Applied {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                  {a.links && (
                    <p className="m3-body-medium mt-1 break-words text-on-surface-variant">
                      {a.links}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        </div>
      </PagePanel>
    </AppShell>
  );
};

export default ProfilePage;
