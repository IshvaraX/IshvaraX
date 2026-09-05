"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/component/nav/AppShell";
import { useAuth } from "@/context/AuthContext";
import { useProjects, type NewProject } from "@/context/ProjectsContext";
import { ApiError, authApi } from "@/lib/api";
import LearningsAdmin from "@/component/admin/LearningsAdmin";
import BlogAdmin from "@/component/admin/BlogAdmin";
import MembersAdmin from "@/component/admin/MembersAdmin";

const ADMIN_USERNAME = "admin";
const ADMIN_PW_KEY = "ishvarax.adminpw";

const emptyForm = {
  title: "",
  description: "",
  skills: "",
  stipend: "",
  duration: "",
  status: "open" as "open" | "closed",
};

const AdminPage = () => {
  const { user, isReady, login } = useAuth();
  const {
    projects,
    addProject,
    deleteProject,
    applicationsFor,
    refreshApplications,
  } = useProjects();
  const [form, setForm] = useState(emptyForm);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPw, setAdminPw] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [cleanupMsg, setCleanupMsg] = useState<string | null>(null);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.username === ADMIN_USERNAME;

  // Restore the admin password (kept only for this tab) and load applications.
  useEffect(() => {
    if (!isAdmin) return;
    const stored = adminPw || sessionStorage.getItem(ADMIN_PW_KEY) || "";
    if (!stored) return;
    if (!adminPw) setAdminPw(stored);
    refreshApplications(stored).catch(() => {});
  }, [isAdmin, adminPw, refreshApplications]);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const project: NewProject = {
      title: form.title.trim(),
      description: form.description.trim(),
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      stipend: form.stipend.trim() || undefined,
      duration: form.duration.trim() || undefined,
      status: form.status,
    };
    setSaving(true);
    try {
      await addProject(project, adminPw);
      setForm(emptyForm);
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Could not publish the project."
      );
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteProject(id, adminPw);
    } catch {
      // ignore — the list stays as-is if the delete fails
    }
  };

  const onCleanup = async () => {
    setCleanupMsg(null);
    setCleanupLoading(true);
    try {
      const res = await authApi.cleanupTokens();
      setCleanupMsg(res.message ?? "Cleanup complete.");
    } catch (err) {
      setCleanupMsg(
        err instanceof ApiError ? err.message : "Cleanup failed."
      );
    } finally {
      setCleanupLoading(false);
    }
  };

  const onAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      await login({ username: ADMIN_USERNAME, password: adminPassword });
      setAdminPw(adminPassword);
      sessionStorage.setItem(ADMIN_PW_KEY, adminPassword);
      refreshApplications(adminPassword).catch(() => {});
      setAdminPassword("");
    } catch (err) {
      setAuthError(
        err instanceof ApiError ? err.message : "Login failed. Check the password."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  if (isReady && !isAdmin) {
    return (
      <AppShell>
        <main className="mx-auto max-w-md px-4 py-24">
          <h1 className="g-heading-lg mb-2 text-center">Admin login</h1>
          <p className="g-body mb-8 text-center">
            Restricted area. Enter the admin password to continue.
          </p>
          <form onSubmit={onAdminLogin} className="g-card flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="g-eyebrow">Username</span>
              <input
                value={ADMIN_USERNAME}
                readOnly
                disabled
                className="g-input opacity-70"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="g-eyebrow">Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="Admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="g-input"
              />
            </label>
            {authError && (
              <p className="text-[0.85rem] text-red-500" role="alert">
                {authError}
              </p>
            )}
            <button
              type="submit"
              disabled={authLoading}
              className="g-btn g-btn-primary disabled:opacity-60"
            >
              {authLoading ? "Signing in…" : "Enter admin panel"}
            </button>
          </form>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <div className="mb-10">
        <Link href="/" className="g-eyebrow inline-block mb-3">
          ← Home
        </Link>
        <h1 className="g-heading-lg">Admin panel</h1>
        <p className="g-body mt-2">
          Add projects and review applications from applicants.
        </p>
      </div>

      {/* Maintenance — uses the backend /auth/cleanup-tokens endpoint */}
      <div className="mb-10 flex flex-wrap items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <span className="g-body flex-1 text-sm">
          Maintenance · remove expired and used password-reset tokens.
        </span>
        <button
          onClick={onCleanup}
          disabled={cleanupLoading}
          className="g-btn disabled:opacity-60"
        >
          {cleanupLoading ? "Cleaning…" : "Clean up reset tokens"}
        </button>
        {cleanupMsg && (
          <span className="g-body w-full text-sm">{cleanupMsg}</span>
        )}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        {/* Add project form */}
        <section className="g-card h-fit">
          <h2 className="g-heading-sm mb-4">Add a project</h2>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <input
              name="title"
              required
              placeholder="Project title"
              value={form.title}
              onChange={onChange}
              className="g-input"
            />
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Description of the work — Markdown supported (**bold**, lists, `code`, links)"
              value={form.description}
              onChange={onChange}
              className="g-input resize-none"
            />
            <input
              name="skills"
              placeholder="Skills (comma separated) e.g. React, Python"
              value={form.skills}
              onChange={onChange}
              className="g-input"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                name="stipend"
                placeholder="Stipend (optional)"
                value={form.stipend}
                onChange={onChange}
                className="g-input"
              />
              <input
                name="duration"
                placeholder="Duration (optional)"
                value={form.duration}
                onChange={onChange}
                className="g-input"
              />
            </div>
            <select
              name="status"
              value={form.status}
              onChange={onChange}
              className="g-input"
            >
              <option value="open">Open for applications</option>
              <option value="closed">Closed</option>
            </select>
            {formError && (
              <p className="text-[0.85rem] text-red-500" role="alert">
                {formError}
              </p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="g-btn g-btn-primary self-start mt-1 disabled:opacity-60"
            >
              {saving ? "Publishing…" : "Publish project"}
            </button>
          </form>
        </section>

        {/* Existing projects + applications */}
        <section>
          <h2 className="g-heading-sm mb-4">
            Projects ({projects.length})
          </h2>
          <div className="flex flex-col gap-4">
            {projects.length === 0 && (
              <p className="g-body">No projects yet. Add your first one.</p>
            )}
            {projects.map((project) => {
              const apps = applicationsFor(project.id);
              const isExpanded = expanded === project.id;
              return (
                <div key={project.id} className="g-card">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="g-heading-sm">{project.title}</h3>
                    <button
                      type="button"
                      onClick={() => onDelete(project.id)}
                      className="g-btn g-btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="g-body mt-2">{project.description}</p>

                  <button
                    type="button"
                    onClick={() =>
                      setExpanded(isExpanded ? null : project.id)
                    }
                    className="g-link mt-4"
                  >
                    {isExpanded ? "Hide" : "View"} applications ({apps.length})
                  </button>

                  {isExpanded && (
                    <div className="mt-4 flex flex-col gap-3 border-t border-[var(--border)] pt-4">
                      {apps.length === 0 && (
                        <p className="g-body">No applications yet.</p>
                      )}
                      {apps.map((app) => (
                        <div
                          key={app.id}
                          className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3"
                        >
                          <div className="flex items-center gap-3">
                            {app.photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={app.photo}
                                alt={app.username}
                                className="h-9 w-9 shrink-0 rounded-lg border border-[var(--border)] object-cover"
                              />
                            ) : null}
                            <div className="min-w-0">
                              <span className="font-semibold text-[0.9rem]">
                                @{app.username}
                              </span>
                              {app.email && (
                                <span className="ml-2 text-[0.8rem] text-[var(--muted)]">
                                  {app.email}
                                </span>
                              )}
                            </div>
                          </div>
                          {app.skills && app.skills.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {app.skills.map((s) => (
                                <span key={s} className="g-chip">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                          {app.language && (
                            <p className="mt-2 text-[0.8rem] text-[var(--muted)]">
                              Languages: {app.language}
                            </p>
                          )}
                          <p className="g-body mt-2 whitespace-pre-wrap break-words text-[0.85rem]">
                            {app.links}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <LearningsAdmin adminPw={adminPw} />
      <BlogAdmin adminPw={adminPw} />
      <MembersAdmin adminPw={adminPw} />
    </main>
    </AppShell>
  );
};

export default AdminPage;
