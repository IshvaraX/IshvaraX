"use client";

import { useState } from "react";
import Link from "next/link";
import { MdCheck, MdClose } from "react-icons/md";
import { useProjects, type Project } from "@/context/ProjectsContext";
import { useAuth } from "@/context/AuthContext";
import { useHomeSearch } from "@/context/HomeSearchContext";
import Markdown from "@/component/ui/Markdown";
import PastelProjectCard from "@/component/projects/PastelProjectCard";
import content from "@/app/site-content.json";

const projectsContent = content.projects;

const FreelanceProjects = () => {
  const { user } = useAuth();
  const { projects, isReady, applyToProject } = useProjects();
  const { query, setQuery } = useHomeSearch();
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
    <section id="projects" className="pt-16 md:pt-24">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="m3-section-title">{projectsContent.heading}</h2>
          <p className="m3-body-large mt-3 text-on-surface-variant">
            {filtered.length} {filtered.length === 1 ? "result" : "results"}
            {query.trim() && <> for “{query.trim()}”</>}
          </p>
        </div>
        <Link href="/projects" className="m3-btn m3-btn-tonal">
          {projectsContent.viewAll}
          <span aria-hidden>→</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        {/* Status — segmented buttons */}
        <div className="m3-segmented" role="group" aria-label="Project status">
          {projectsContent.filters.map((chip) => {
            const activeChip = filter === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                aria-pressed={activeChip}
                onClick={() => setFilter(chip.key)}
                className="m3-segment"
              >
                {activeChip && <MdCheck aria-hidden />}
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Skills — filter chips */}
        {skillChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="m3-label-medium text-on-surface-variant">
              Skills
            </span>
            {skillChips.map((s) => {
              const activeChip = filter === s;
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={activeChip}
                  onClick={() => setFilter(activeChip ? "all" : s)}
                  className="m3-chip"
                >
                  {activeChip && <MdCheck aria-hidden />}
                  {s}
                </button>
              );
            })}
          </div>
        )}

        {/* Clear — only when something is active */}
        {(filter !== "all" || query.trim()) && (
          <button
            type="button"
            onClick={() => {
              setFilter("all");
              setQuery("");
            }}
            className="m3-btn m3-btn-text ml-auto"
          >
            Clear filters <MdClose aria-hidden />
          </button>
        )}
      </div>

      {isReady && filtered.length === 0 ? (
        <div className="m3-tile">
          <div className="m3-tile-body">
            <p className="m3-tile-desc">{projectsContent.emptyFiltered}</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((project) => {
            const isOpen = project.status === "open";
            return (
              <PastelProjectCard
                key={project.id}
                project={project}
                showStatus
                label={isOpen ? "Apply now" : "Learn more"}
                onAction={isOpen ? () => openApply(project) : undefined}
              />
            );
          })}
        </div>
      )}

      {/* Apply dialog */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="apply-title"
        >
          <div
            className="m3-scrim absolute inset-0"
            onClick={() => setActive(null)}
          />
          <div className="m3-dialog relative max-h-[85vh] w-full max-w-md overflow-y-auto">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="m3-label-large mb-1 text-primary">Apply</p>
                <h3 id="apply-title" className="m3-headline-small">{active.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="m3-icon-btn -mr-2 -mt-2"
              >
                <MdClose />
              </button>
            </div>

            <Markdown className="m3-body-medium mb-5 border-b border-outline-variant pb-5 text-on-surface-variant">
              {active.description}
            </Markdown>

            {submitted ? (
              <p className="m3-body-large text-secondary" role="status">
                Application received — we&apos;ll be in touch. Thank you!
              </p>
            ) : !user ? (
              <div className="flex flex-col gap-4">
                <p className="m3-body-medium text-on-surface-variant">
                  Please log in to apply for this project.
                </p>
                <Link href="/login" className="m3-btn m3-btn-filled self-start">
                  Log in
                </Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <p className="m3-body-medium text-on-surface-variant">
                  Applying as{" "}
                  <strong className="font-medium text-on-surface">
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
                  <p className="m3-body-small text-error" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="m3-btn m3-btn-filled self-start"
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
