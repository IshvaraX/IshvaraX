"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppShell from "@/component/nav/AppShell";
import { useProjects } from "@/context/ProjectsContext";
import ProjectCard from "@/component/projects/ProjectCard";

const ProjectsPage = () => {
  const { projects, isReady } = useProjects();
  const openCount = projects.filter((p) => p.status === "open").length;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Default to the project from ?id=, else the first once the list has loaded.
  useEffect(() => {
    if (selectedId || projects.length === 0) return;
    const wanted = new URLSearchParams(window.location.search).get("id");
    const match = wanted && projects.find((p) => p.id === wanted);
    setSelectedId(match ? match.id : projects[0].id);
  }, [projects, selectedId]);

  const selected = useMemo(
    () => projects.find((p) => p.id === selectedId) ?? null,
    [projects, selectedId]
  );

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-8">
          <Link href="/" className="g-eyebrow inline-block mb-3">
            ← Home
          </Link>
          <h1 className="g-heading-lg">Open projects</h1>
          <p className="g-body mt-2">
            {isReady
              ? `${openCount} open opportunit${openCount === 1 ? "y" : "ies"} for coders who want to build with PINAKA.`
              : "Loading opportunities…"}
          </p>
        </div>

        {isReady && projects.length === 0 ? (
          <p className="g-body">No projects are listed yet. Check back soon.</p>
        ) : (
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar — project list */}
            <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:h-fit lg:w-[320px]">
              <ul className="flex flex-col gap-2">
                {projects.map((project) => {
                  const isActive = project.id === selectedId;
                  const isOpen = project.status === "open";
                  return (
                    <li key={project.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(project.id)}
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
                          <span className="font-semibold">{project.title}</span>
                          <span
                            className={`g-badge ${
                              isOpen ? "g-badge-open" : "g-badge-closed"
                            }`}
                          >
                            {isOpen ? "Open" : "Closed"}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-[0.8rem] text-[var(--muted)]">
                          {project.description}
                        </p>
                        {project.skills.length > 0 && (
                          <p className="mt-1 truncate text-[0.78rem] text-[var(--muted)]">
                            {project.skills.slice(0, 3).join(" · ")}
                          </p>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            {/* Detail — full description of the selected project */}
            <section className="min-w-0 flex-1">
              {selected ? (
                <ProjectCard key={selected.id} project={selected} featured />
              ) : (
                <p className="g-body">Select a project to see the details.</p>
              )}
            </section>
          </div>
        )}
      </main>
    </AppShell>
  );
};

export default ProjectsPage;
