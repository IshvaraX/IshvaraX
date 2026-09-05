"use client";

import { useState } from "react";
import Link from "next/link";
import { useProjects, type Project } from "@/context/ProjectsContext";
import { useAuth } from "@/context/AuthContext";
import { useHomeSearch } from "@/context/HomeSearchContext";
import Markdown from "@/component/ui/Markdown";
import content from "@/app/site-content.json";

const projectsContent = content.projects;

const FreelanceProjects = () => {
  const { user } = useAuth();
  const { projects, isReady, applyToProject } = useProjects();
  const { query } = useHomeSearch();
  const [filter, setFilter] = useState<string>("all");
  const [active, setActive] = useState<Project | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [links, setLinks] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter chips: status plus the most common skills across projects.
  const skillChips = (() => {
    const counts = new Map<string, number>();
    for (const p of projects)
      for (const s of p.skills) counts.set(s, (counts.get(s) ?? 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([s]) => s);
  })();

  const q = query.trim().toLowerCase();
  const filtered = projects.filter((p) => {
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.skills.some((s) => s.toLowerCase().includes(q));
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "open" || filter === "closed"
        ? p.status === filter
        : p.skills.includes(filter);
    return matchesQuery && matchesFilter;
  });

  const openApply = (p: Project) => {
    setActive(p);
    setSubmitted(false);
    setLinks("");
    setError(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!active || !user) return;
    setError(null);
    setSending(true);
    try {
      await applyToProject(active.id, { username: user.username, links });
      setSubmitted(true);
    } catch {
      setError("Could not submit your application. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="projects" className="border-t border-[var(--border)] px-4 py-20 md:px-8 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-[var(--accent-2)]">
              {`// ${projectsContent.label}`}
            </span>
            <h2 className="g-heading-lg mt-2 !text-3xl md:!text-5xl">
              {projectsContent.heading}
            </h2>
            <p className="mt-2 text-[var(--muted)]">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
              {query.trim() && <> for “{query.trim()}”</>}
            </p>
          </div>
          <Link href="/projects" className="g-btn">
            {projectsContent.viewAll}
          </Link>
        </div>

        {/* Filter chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          {[
            ...projectsContent.filters,
            ...skillChips.map((s) => ({ key: s, label: s })),
          ].map((chip) => {
            const activeChip = filter === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => setFilter(chip.key)}
                className="rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors"
                style={{
                  background: activeChip ? "var(--accent)" : "var(--surface)",
                  color: activeChip ? "var(--on-accent)" : "var(--foreground)",
                  borderColor: activeChip ? "var(--accent)" : "var(--border)",
                }}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {isReady && filtered.length === 0 ? (
          <p className="g-body">{projectsContent.emptyFiltered}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => {
              const isOpen = project.status === "open";
              return (
                <article
                  key={project.id}
                  onClick={() => isOpen && openApply(project)}
                  className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-transform hover:-translate-y-1"
                  style={{ cursor: isOpen ? "pointer" : "default" }}
                >
                  <span
                    className="inline-flex w-fit items-center rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-widest"
                    style={{
                      background: isOpen ? "var(--status-open)" : "var(--border)",
                      color: isOpen ? "#202124" : "var(--muted)",
                    }}
                  >
                    {isOpen ? "Open" : "Closed"}
                  </span>
                  <h3 className="g-heading-sm mt-4 text-xl">{project.title}</h3>
                  <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8rem] text-[var(--muted)]">
                    {project.skills[0] && <span>{project.skills[0]}</span>}
                    {project.duration && (
                      <>
                        <span className="opacity-40">·</span>
                        <span>{project.duration}</span>
                      </>
                    )}
                  </p>
                  <div className="mt-3 line-clamp-4 text-[var(--muted)]">
                    <Markdown className="g-body !text-[0.9rem]">
                      {project.description}
                    </Markdown>
                  </div>
                  {isOpen && (
                    <span className="g-link mt-5 font-semibold text-[var(--accent-2)]">
                      Apply <span className="arrow">→</span>
                    </span>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Apply modal */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setActive(null)}
          />
          <div className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="g-label mb-1">Apply</p>
                <h3 className="g-heading-sm">{active.title}</h3>
              </div>
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="text-lg text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            <Markdown className="g-body mb-5 border-b border-[var(--border)] pb-5 text-[0.9rem]">
              {active.description}
            </Markdown>

            {submitted ? (
              <p
                className="g-body"
                style={{ color: "var(--status-open)" }}
                role="status"
              >
                Application received — we&apos;ll be in touch. Thank you!
              </p>
            ) : !user ? (
              <div className="flex flex-col gap-4">
                <p className="g-body text-sm">
                  Please log in to apply for this project.
                </p>
                <Link href="/login" className="g-btn g-btn-primary self-start">
                  Log in
                </Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <p className="g-body text-sm">
                  Applying as{" "}
                  <strong className="text-[var(--foreground)]">
                    @{user.username}
                  </strong>
                </p>
                <textarea
                  required
                  rows={3}
                  placeholder="Paste your work links — portfolio, GitHub, live demos…"
                  value={links}
                  onChange={(e) => setLinks(e.target.value)}
                  className="g-input resize-none"
                />
                {error && (
                  <p className="text-[0.85rem] text-red-500" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="g-btn g-btn-primary self-start disabled:opacity-60"
                >
                  {sending ? "Submitting…" : "Submit application"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default FreelanceProjects;
