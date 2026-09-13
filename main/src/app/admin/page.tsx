"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppShell from "@/component/nav/AppShell";
import { useAuth } from "@/context/AuthContext";
import { useProjects, type NewProject } from "@/context/ProjectsContext";
import { ApiError, authApi } from "@/lib/api";
import Markdown from "@/component/ui/Markdown";
import LearningsAdmin from "@/component/admin/LearningsAdmin";
import BlogAdmin from "@/component/admin/BlogAdmin";
import MembersAdmin from "@/component/admin/MembersAdmin";
import StorageAdmin from "@/component/admin/StorageAdmin";

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
    setProjectStatus,
    applicationsFor,
    refreshApplications,
  } = useProjects();
  const [form, setForm] = useState(emptyForm);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [activeSection, setActiveSection] = useState<
    "projects" | "learnings" | "blog" | "members" | "storage"
  >("projects");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPw, setAdminPw] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [cleanupMsg, setCleanupMsg] = useState<string | null>(null);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.username === ADMIN_USERNAME;

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  // Default to the first project once the list has loaded.
  useEffect(() => {
    if (!selectedProjectId && projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

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

  const onToggleStatus = async (id: string, current: "open" | "closed") => {
    try {
      await setProjectStatus(id, current === "open" ? "closed" : "open", adminPw);
    } catch {
      // ignore — the list stays as-is if the update fails
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
      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      {/* Compact header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-medium tracking-tight">Admin panel</h1>
          <span className="text-sm text-[var(--muted)]">
            Projects, content, members &amp; storage
          </span>
        </div>
        <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
          ← Back to site
        </Link>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Section sidebar */}
        <aside className="w-full shrink-0 lg:sticky lg:top-20 lg:h-fit lg:w-44">
          <nav className="flex flex-wrap gap-1 lg:flex-col">
            {(
              [
                { key: "projects", label: "Projects" },
                { key: "learnings", label: "Learnings" },
                { key: "blog", label: "Blog" },
                { key: "members", label: "Members" },
                { key: "storage", label: "Storage" },
              ] as const
            ).map((item) => {
              const isActive = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveSection(item.key)}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors"
                  style={{
                    background: isActive
                      ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                      : "transparent",
                    color: isActive ? "var(--accent-2)" : "var(--foreground)",
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Maintenance, tucked under the nav */}
          <div className="mt-4 border-t border-[var(--border)] pt-3 lg:mt-6">
            <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Maintenance
            </p>
            <button
              onClick={onCleanup}
              disabled={cleanupLoading}
              className="g-btn w-full justify-center px-3 py-2 text-xs disabled:opacity-60"
              title="Remove expired and used password-reset tokens"
            >
              {cleanupLoading ? "Cleaning…" : "Clean up reset tokens"}
            </button>
            {cleanupMsg && (
              <p className="mt-1 text-xs text-[var(--muted)]">{cleanupMsg}</p>
            )}
          </div>
        </aside>

        {/* Active section content */}
        <div className="min-w-0 flex-1">
          {activeSection === "projects" && (
            <div className="grid gap-6 xl:grid-cols-3 lg:grid-cols-2">
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

        {/* Projects list — short previews */}
        <section className="min-w-0">
          <h2 className="g-heading-sm mb-4">Projects ({projects.length})</h2>
          {projects.length === 0 ? (
            <p className="g-body">No projects yet. Add your first one.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {projects.map((project) => {
                const isActive = project.id === selectedProjectId;
                const isOpen = project.status === "open";
                return (
                  <li key={project.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedProjectId(project.id)}
                      className="w-full rounded-xl border p-4 text-left transition-colors"
                      style={{
                        borderColor: isActive
                          ? "var(--accent)"
                          : "var(--border)",
                        background: isActive
                          ? "color-mix(in srgb, var(--accent) 8%, var(--background))"
                          : "var(--surface)",
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-[0.95rem]">
                          {project.title}
                        </span>
                        <span
                          className={`g-badge ${
                            isOpen ? "g-badge-open" : "g-badge-closed"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[0.8rem] text-[var(--muted)]">
                        {project.description}
                      </p>
                      <span className="mt-1 block text-[0.72rem] text-[var(--muted)]">
                        {applicationsFor(project.id).length} application
                        {applicationsFor(project.id).length === 1 ? "" : "s"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Full preview of the selected project + applications */}
        <section className="min-w-0 lg:sticky lg:top-20 lg:h-fit">
          {selectedProject ? (
            <div className="g-card flex flex-col lg:max-h-[calc(100vh-6rem)]">
              <div className="flex shrink-0 flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <h3 className="g-heading-md">{selectedProject.title}</h3>
                  <span
                    className={`g-badge ${
                      selectedProject.status === "open"
                        ? "g-badge-open"
                        : "g-badge-closed"
                    }`}
                  >
                    {selectedProject.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onToggleStatus(selectedProject.id, selectedProject.status)
                    }
                    className="g-btn"
                  >
                    {selectedProject.status === "open"
                      ? "Mark closed"
                      : "Mark open"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(selectedProject.id)}
                    className="g-btn g-btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-3 min-h-0 flex-1 overflow-y-auto lg:pr-2">
              <Markdown className="text-[0.85rem] text-[var(--muted)]">
                {selectedProject.description}
              </Markdown>

              {selectedProject.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedProject.skills.map((skill) => (
                    <span key={skill} className="g-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {(selectedProject.stipend || selectedProject.duration) && (
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[0.8rem] text-[var(--muted)]">
                  {selectedProject.stipend && (
                    <span>Stipend · {selectedProject.stipend}</span>
                  )}
                  {selectedProject.duration && (
                    <span>Duration · {selectedProject.duration}</span>
                  )}
                </div>
              )}

              {/* Applications */}
              <div className="mt-6 border-t border-[var(--border)] pt-4">
                <h4 className="g-heading-sm mb-3 text-sm">
                  Applications ({applicationsFor(selectedProject.id).length})
                </h4>
                <div className="flex flex-col gap-3">
                  {applicationsFor(selectedProject.id).length === 0 && (
                    <p className="g-body text-sm">No applications yet.</p>
                  )}
                  {applicationsFor(selectedProject.id).map((app) => (
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
                          <span className="block font-semibold text-[0.9rem]">
                            @{app.username}
                          </span>
                          {app.email && (
                            <span className="block truncate text-[0.8rem] text-[var(--muted)]">
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
              </div>
              </div>
            </div>
          ) : (
            <p className="g-body">Select a project to see the full preview.</p>
          )}
        </section>
            </div>
          )}

          {activeSection === "learnings" && <LearningsAdmin adminPw={adminPw} />}
          {activeSection === "blog" && <BlogAdmin adminPw={adminPw} />}
          {activeSection === "members" && <MembersAdmin adminPw={adminPw} />}
          {activeSection === "storage" && <StorageAdmin adminPw={adminPw} />}
        </div>
      </div>
    </main>
    </AppShell>
  );
};

export default AdminPage;
