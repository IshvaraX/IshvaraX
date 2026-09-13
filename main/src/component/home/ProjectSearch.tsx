"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useHomeSearch } from "@/context/HomeSearchContext";
import { useProjects } from "@/context/ProjectsContext";
import { useAuth } from "@/context/AuthContext";
import PastelProjectCard from "@/component/projects/PastelProjectCard";
import CornerNotch from "@/component/ui/CornerNotch";

/**
 * Full-bleed "search for your project" band. A white card floats on the left
 * with a dark Search button hanging off its corner; matching results (or the
 * most recent projects) appear as pastel tiles right beside it.
 */
const ProjectSearch = ({ hero = false }: { hero?: boolean }) => {
  const { query, setQuery } = useHomeSearch();
  const { projects, isReady } = useProjects();
  const [skill, setSkill] = useState("");
  const [keyword, setKeyword] = useState("");
  const { user } = useAuth();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery([skill, keyword].map((s) => s.trim()).filter(Boolean).join(" "));
  };

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    const sorted = [...projects].sort((a, b) => b.createdAt - a.createdAt);
    if (!q) return sorted.slice(0, 4);
    const terms = q.split(/\s+/);
    return sorted
      .filter((p) => {
        const hay = `${p.title} ${p.description} ${p.skills.join(" ")}`.toLowerCase();
        return terms.every((t) => hay.includes(t));
      })
      .slice(0, 4);
  }, [projects, q]);

  return (
    <section
      id="search"
      className="relative overflow-hidden bg-[var(--background)]"
    >
      <div
        className={`relative mx-auto grid w-full max-w-7xl gap-12 px-4 md:px-8 lg:grid-cols-[minmax(0,30rem)_1fr] lg:gap-16 ${
          hero ? "items-start py-8 md:py-10" : "items-center py-20 md:py-28"
        }`}
      >
        {/* Floating card */}
        <div className="relative w-full">
          <form
            onSubmit={onSubmit}
            className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 pb-24 md:p-10 md:pb-24"
          >
            {hero && user && (
              <p className="mb-3 text-sm font-medium text-[var(--muted)]">
                Welcome back, @{user.username}
              </p>
            )}
            <h2 className="text-[clamp(1.9rem,3.2vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[var(--foreground)]">
              Search for your
              <br />
              next project.
            </h2>

            <div className="mt-12 flex flex-col gap-5">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[var(--muted)]">Skill</span>
                <input
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="React"
                  className="w-full rounded-full border border-[var(--ink)] bg-[var(--background)] px-5 py-3 text-base text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[var(--muted)]">
                  Looking for?
                </span>
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Logo design"
                  className="w-full rounded-full border border-[var(--ink)] bg-[var(--background)] px-5 py-3 text-base text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
                />
              </label>
            </div>

            {/* Search button sits in a notch cut into the card's corner */}
            <CornerNotch surface="var(--surface)" behind="var(--background)">
              <button
                type="submit"
                className="g-pill g-pill-primary px-10 py-4 text-base"
              >
                Search
              </button>
            </CornerNotch>
          </form>
        </div>

        {/* Results / recent projects */}
        <div className="min-w-0 max-w-[46rem]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-[var(--muted)]">
              {q
                ? `${results.length} ${results.length === 1 ? "match" : "matches"} for “${query.trim()}”`
                : "Recent projects"}
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-2)] hover:underline"
            >
              See all <span aria-hidden>›</span>
            </Link>
          </div>

          {!isReady ? (
            <p className="text-sm text-[var(--muted)]">Loading projects…</p>
          ) : results.length === 0 ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-[var(--foreground)]">
              <p className="font-medium">No projects match that search.</p>
              <button
                type="button"
                onClick={() => {
                  setSkill("");
                  setKeyword("");
                  setQuery("");
                }}
                className="mt-3 text-sm text-[var(--accent-2)] underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {results.map((p) => (
                <PastelProjectCard
                  key={p.id}
                  project={p}
                  notchColor="var(--background)"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectSearch;
