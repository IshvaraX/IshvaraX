"use client";

import { useState } from "react";
import Link from "next/link";
import { useProjects, type Project } from "@/context/ProjectsContext";
import { useAuth } from "@/context/AuthContext";
import Markdown from "@/component/ui/Markdown";

type ProjectCardProps = {
  project: Project;
  featured?: boolean;
  onDelete?: (id: string) => void;
};

const ProjectCard = ({ project, featured, onDelete }: ProjectCardProps) => {
  const { user } = useAuth();
  const { applyToProject } = useProjects();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [links, setLinks] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSending(true);
    try {
      await applyToProject(project.id, { username: user.username, links });
      setSubmitted(true);
      setLinks("");
    } catch {
      setError("Could not submit your application. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const isOpen = project.status === "open";

  return (
    <article
      className={`g-card flex flex-col ${featured ? "g-card-featured" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className={featured ? "g-heading-md" : "g-heading-sm"}>
          {project.title}
        </h3>
        <span className={`g-badge ${isOpen ? "g-badge-open" : "g-badge-closed"}`}>
          {isOpen ? "Open" : "Closed"}
        </span>
      </div>

      <Markdown className="g-body mt-2 flex-1">{project.description}</Markdown>

      {project.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.skills.map((skill) => (
            <span key={skill} className="g-chip">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[0.8rem] text-[var(--muted)]">
        {project.stipend && <span>Stipend · {project.stipend}</span>}
        {project.duration && <span>Duration · {project.duration}</span>}
      </div>

      <div className="mt-5 flex items-center gap-3">
        {isOpen && (
          <button
            type="button"
            onClick={() => {
              setOpen((o) => !o);
              setSubmitted(false);
            }}
            className="g-btn g-btn-primary"
          >
            {open ? "Close" : "Apply now"}
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(project.id)}
            className="g-btn g-btn-danger"
          >
            Delete
          </button>
        )}
      </div>

      {open && isOpen && (
        <div className="mt-5 border-t border-[var(--border)] pt-5">
          {submitted ? (
            <p className="g-body text-[var(--status-open)]" role="status">
              Application received — we&apos;ll be in touch. Thank you!
            </p>
          ) : !user ? (
            <div className="flex flex-col gap-3">
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
                name="links"
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
      )}
    </article>
  );
};

export default ProjectCard;
