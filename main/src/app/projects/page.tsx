"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import AppShell from "@/component/nav/AppShell";
import PagePanel from "@/component/ui/PagePanel";
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
      <PagePanel>
        <div className="mb-8">
          <Link href="/" className="m3-btn m3-btn-text -ml-3 mb-3">
            <MdArrowBack aria-hidden />
            Home
          </Link>
          <h1 className="m3-section-title">Open projects</h1>
          <p className="m3-body-large mt-3 text-on-surface-variant">
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
            <aside className="w-full shrink-0 lg:sticky lg:top-4 lg:h-fit lg:w-[320px]">
              <ul className="flex flex-col gap-2">
                {projects.map((project) => {
                  const isActive = project.id === selectedId;
                  const isOpen = project.status === "open";
                  return (
                    <li key={project.id}>
                      <button
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setSelectedId(project.id)}
                        className={`m3-list-card ${isActive ? "is-selected" : ""}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="m3-title-medium">{project.title}</span>
                          <span
                            className={`g-badge ${
                              isOpen ? "g-badge-open" : "g-badge-closed"
                            }`}
                          >
                            {isOpen ? "Open" : "Closed"}
                          </span>
                        </div>
                        <p className="m3-body-medium m3-supporting mt-1 line-clamp-2">
                          {project.description}
                        </p>
                        {project.skills.length > 0 && (
                          <p className="m3-body-small m3-supporting mt-1 truncate">
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
      </PagePanel>
    </AppShell>
  );
};

export default ProjectsPage;
