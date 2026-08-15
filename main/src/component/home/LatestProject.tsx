"use client";

import Link from "next/link";
import { useProjects } from "@/context/ProjectsContext";
import ProjectCard from "@/component/projects/ProjectCard";

const LatestProject = () => {
  const { latestProject, isReady } = useProjects();

  if (!isReady || !latestProject) return null;

  return (
    <section id="opportunities" className="px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="g-contained g-contained-green p-6 md:p-12">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="g-label block mb-2">Latest opportunity</span>
              <h2 className="g-heading-lg">Build with us</h2>
            </div>
            <Link href="/projects" className="g-link">
              View all projects <span className="arrow">→</span>
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ProjectCard project={latestProject} featured />
            <div className="flex flex-col justify-center rounded-lg bg-[var(--background)] border border-[var(--border)] p-8">
              <h3 className="g-heading-md mb-2">New here?</h3>
              <p className="g-body mb-5">
                Explore projects and get involved with a community that loves to
                code. Pick something that interests you and start collaborating.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/register" className="g-btn g-btn-primary">
                  Join the community
                </Link>
                <Link href="/projects" className="g-btn">
                  Browse projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestProject;
