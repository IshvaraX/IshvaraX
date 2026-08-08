"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/component/nav/AppShell";
import { useAuth } from "@/context/AuthContext";
import { useProjects, type NewProject } from "@/context/ProjectsContext";
import { ApiError } from "@/lib/api";

const ADMIN_USERNAME = "admin";

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
  } = useProjects();
  const [form, setForm] = useState(emptyForm);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    addProject(project);
    setForm(emptyForm);
  };

  const isAdmin = user?.username === ADMIN_USERNAME;

  const onAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      await login({ username: ADMIN_USERNAME, password: adminPassword });
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
              placeholder="Short description of the work"
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
            <button type="submit" className="g-btn g-btn-primary self-start mt-1">
              Publish project
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
                      onClick={() => deleteProject(project.id)}
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
                    <div className="mt-4 flex flex-col gap-3 border-t border-[rgb(var(--border-rgb))] pt-4">
                      {apps.length === 0 && (
                        <p className="g-body">No applications yet.</p>
                      )}
                      {apps.map((app) => (
                        <div
                          key={app.id}
                          className="rounded-xl bg-[rgb(var(--surface-rgb))] p-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-[0.9rem]">
                              {app.name}
                            </span>
                            <a
                              href={`mailto:${app.email}`}
                              className="g-link text-[0.8rem]"
                            >
                              {app.email}
                            </a>
                          </div>
                          <p className="g-body text-[0.85rem] mt-1">
                            {app.message}
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
    </main>
    </AppShell>
  );
};

export default AdminPage;
