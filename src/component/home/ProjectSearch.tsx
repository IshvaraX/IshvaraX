"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MdChevronRight, MdSearch } from "react-icons/md";
import { useHomeSearch } from "@/context/HomeSearchContext";
import { useProjects } from "@/context/ProjectsContext";
import PastelProjectCard from "@/component/projects/PastelProjectCard";

/**
 * "Search for your next project": a panel with the form on the left and the
 * matching (or most recent) projects as tiles on the right.
 */
const ProjectSearch = () => {
  const { query, setQuery } = useHomeSearch();
  const { projects, isReady } = useProjects();
  const [skill, setSkill] = useState("");
  const [keyword, setKeyword] = useState("");

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
    <section id="search" className="pt-16 md:pt-24">
      <h2 className="m3-section-title">Search for your next project</h2>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,24rem)_1fr]">
        {/* Search panel */}
        <form onSubmit={onSubmit} className="m3-panel flex h-fit flex-col gap-5 p-6 md:p-8">
          <p className="m3-body-large text-on-surface-variant">
            Filter by a skill, a keyword, or both.
          </p>
          <label className="m3-field">
            <input
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="React"
              className="g-input"
            />
            <span className="m3-field-label">Skill</span>
          </label>
          <label className="m3-field">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Logo design"
              className="g-input"
            />
            <span className="m3-field-label">Looking for?</span>
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button type="submit" className="m3-btn m3-btn-filled pl-4">
              <MdSearch />
              Search
            </button>
            {(q || skill || keyword) && (
              <button
                type="button"
                onClick={() => {
                  setSkill("");
                  setKeyword("");
                  setQuery("");
                }}
                className="m3-btn m3-btn-text"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Results / recent projects */}
        <div className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="m3-label-large text-on-surface-variant">
              {q
                ? `${results.length} ${results.length === 1 ? "match" : "matches"} for “${query.trim()}”`
                : "Recent projects"}
            </p>
            <Link href="/projects" className="m3-btn m3-btn-text -mr-3 pr-2">
              See all <MdChevronRight />
            </Link>
          </div>

          {!isReady ? (
            <p className="m3-body-medium text-on-surface-variant">Loading projects…</p>
          ) : results.length === 0 ? (
            <div className="m3-tile">
              <div className="m3-tile-body">
                <p className="m3-tile-title">No projects match that search.</p>
                <p className="m3-tile-desc">Try a different skill or keyword.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {results.map((p) => (
                <PastelProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectSearch;
