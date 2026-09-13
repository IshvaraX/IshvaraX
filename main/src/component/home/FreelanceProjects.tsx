"use client";

import { useRef, useState } from "react";
import Link from "next/link";
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
  const rowRef = useRef<HTMLDivElement>(null);

  const scrollRow = (dir: 1 | -1) => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

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
    <section id="projects" className="bg-[var(--background)] px-4 py-20 md:px-8 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              {projectsContent.label}
            </span>
            <h2 className="mt-4 text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-[var(--foreground)]">
              {projectsContent.heading}
            </h2>
            <p className="mt-3 text-[var(--muted)]">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
              {query.trim() && <> for “{query.trim()}”</>}
            </p>
          </div>
          <Link href="/projects" className="g-pill g-pill-primary">
            {projectsContent.viewAll}
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          {/* Status — segmented control */}
          <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
            {projectsContent.filters.map((chip) => {
              const activeChip = filter === chip.key;
              return (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => setFilter(chip.key)}
                  className="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
                  style={{
                    background: activeChip ? "var(--accent)" : "transparent",
                    color: activeChip ? "var(--on-accent)" : "var(--muted)",
                  }}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Skills */}
          {skillChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                Skills
              </span>
              {skillChips.map((s) => {
                const activeChip = filter === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFilter(activeChip ? "all" : s)}
                    className="rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors"
                    style={{
                      background: activeChip ? "var(--accent)" : "transparent",
                      color: activeChip ? "#ffffff" : "var(--foreground)",
                      borderColor: activeChip ? "var(--accent)" : "var(--border)",
                    }}
                  >
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
              className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              Clear filters <span aria-hidden>×</span>
            </button>
          )}
        </div>

        {isReady && filtered.length === 0 ? (
          <p className="g-body">{projectsContent.emptyFiltered}</p>
        ) : (
          <div className="relative">
            {/* Horizontal row of pastel tiles */}
            <div
              ref={rowRef}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {filtered.map((project) => {
                const isOpen = project.status === "open";
                return (
                  <div
                    key={project.id}
                    className="w-[min(80vw,19rem)] shrink-0 snap-start"
                  >
                    <PastelProjectCard
                      project={project}
                      showStatus
                      className="h-full min-h-[22rem]"
                      label={isOpen ? "Apply now" : "Learn more"}
                      onAction={isOpen ? () => openApply(project) : undefined}
                    />
                  </div>
                );
              })}
            </div>

            {/* Prev / next chevrons */}
            {filtered.length > 3 && (
              <>
                <button
                  type="button"
                  aria-label="Scroll projects left"
                  onClick={() => scrollRow(-1)}
                  className="absolute -left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] text-xl text-[var(--foreground)] transition-colors hover:bg-[var(--surface)] lg:flex"
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Scroll projects right"
                  onClick={() => scrollRow(1)}
                  className="absolute -right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] text-xl text-[var(--foreground)] transition-colors hover:bg-[var(--surface)] lg:flex"
                >
                  ›
                </button>
              </>
            )}
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
