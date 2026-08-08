"use client";

import { useState } from "react";
import { useProjects, type Project } from "@/context/ProjectsContext";

type ProjectCardProps = {
  project: Project;
  featured?: boolean;
  onDelete?: (id: string) => void;
};

const ProjectCard = ({ project, featured, onDelete }: ProjectCardProps) => {
  const { applyToProject } = useProjects();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyToProject(project.id, form);
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
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

      <p className="g-body mt-2 flex-1">{project.description}</p>

      {project.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.skills.map((skill) => (
            <span key={skill} className="g-chip">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[0.8rem] text-[rgb(var(--muted-rgb))]">
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
        <div className="mt-5 border-t border-[rgb(var(--border-rgb))] pt-5">
          {submitted ? (
            <p className="g-body text-[rgb(var(--g-green))]" role="status">
              Application received — we&apos;ll be in touch. Thank you!
            </p>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
              <input
                name="name"
                required
                placeholder="Your name"
                autoComplete="name"
                value={form.name}
                onChange={onChange}
                className="g-input"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Your email"
                autoComplete="email"
                value={form.email}
                onChange={onChange}
                className="g-input"
              />
              <textarea
                name="message"
                required
                rows={3}
                placeholder="Why are you a great fit? Share links to your work."
                value={form.message}
                onChange={onChange}
                className="g-input resize-none"
              />
              <button type="submit" className="g-btn g-btn-primary self-start">
                Submit application
              </button>
            </form>
          )}
        </div>
      )}
    </article>
  );
};

export default ProjectCard;
