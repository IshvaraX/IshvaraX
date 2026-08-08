"use client";

import Link from "next/link";
import AppShell from "@/component/nav/AppShell";
import { useProjects } from "@/context/ProjectsContext";
import ProjectCard from "@/component/projects/ProjectCard";

const ProjectsPage = () => {
  const { projects, isReady } = useProjects();
  const openCount = projects.filter((p) => p.status === "open").length;

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-10">
        <Link href="/" className="g-eyebrow inline-block mb-3">
          ← Home
        </Link>
        <h1 className="g-heading-lg">Open projects</h1>
        <p className="g-body mt-2">
          {isReady
            ? `${openCount} open opportunity${openCount === 1 ? "" : "ies"} for coders who want to build with PINAKA.`
            : "Loading opportunities…"}
        </p>
      </div>

      {isReady && projects.length === 0 ? (
        <p className="g-body">
          No projects are listed yet. Check back soon.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </main>
    </AppShell>
  );
};

export default ProjectsPage;
