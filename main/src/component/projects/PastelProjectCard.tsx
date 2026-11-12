import Link from "next/link";
import type { CSSProperties } from "react";
import { MdOutlineWork } from "react-icons/md";
import type { Project } from "@/context/ProjectsContext";

export type Tone = { bg: string; fg: string; btn: string; onBtn: string };

const PALETTE: Tone[] = [
  {
    bg: "var(--md-sys-color-primary-container)",
    fg: "var(--md-sys-color-on-primary-container)",
    btn: "var(--md-sys-color-primary)",
    onBtn: "var(--md-sys-color-on-primary)",
  },
  {
    bg: "var(--md-sys-color-secondary-container)",
    fg: "var(--md-sys-color-on-secondary-container)",
    btn: "var(--md-sys-color-secondary)",
    onBtn: "var(--md-sys-color-on-secondary)",
  },
  {
    bg: "var(--md-sys-color-tertiary-container)",
    fg: "var(--md-sys-color-on-tertiary-container)",
    btn: "var(--md-sys-color-tertiary)",
    onBtn: "var(--md-sys-color-on-tertiary)",
  },
  {
    bg: "var(--md-extended-color-amber-container)",
    fg: "var(--md-extended-color-on-amber-container)",
    btn: "var(--md-extended-color-amber)",
    onBtn: "var(--md-extended-color-on-amber)",
  },
];

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

export const pastelFor = (key: string) => PALETTE[hash(key) % PALETTE.length];
export const pastelAt = (i: number) => PALETTE[i % PALETTE.length];

export const toneStyle = (tone: Tone): CSSProperties =>
  ({ background: tone.bg, color: tone.fg, "--pc-text": tone.fg }) as CSSProperties;

type Props = {
  project: Project;
  href?: string;
  label?: string;
  className?: string;
  onAction?: () => void;
  showStatus?: boolean;
};

const PastelProjectCard = ({
  project,
  href = `/projects?id=${project.id}`,
  label = "View project",
  className = "",
  onAction,
  showStatus = false,
}: Props) => {
  const tone = pastelFor(project.id);
  const isOpen = project.status === "open";
  const chipStyle = { background: tone.btn, color: tone.onBtn };
  return (
    <article className={`m3-tile is-interactive ${className}`}>
      <div
        className="m3-tile-media flex min-h-[9.5rem] flex-col justify-between p-4"
        style={toneStyle(tone)}
      >
        <div className="flex items-start justify-between gap-2">
          <MdOutlineWork className="h-5 w-5" aria-hidden />
          {showStatus && (
            <span
              className="m3-label-medium inline-flex h-6 items-center rounded-full px-2.5"
              style={
                isOpen
                  ? chipStyle
                  : {
                      background: "var(--md-sys-color-surface-container-highest)",
                      color: "var(--md-sys-color-on-surface-variant)",
                    }
              }
            >
              {isOpen ? "Open" : "Closed"}
            </span>
          )}
        </div>
        {project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.skills.slice(0, 3).map((s) => (
              <span key={s} className="m3-label-medium rounded-full px-2.5 py-1" style={chipStyle}>
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="m3-tile-body">
        <h3 className="m3-tile-title">{project.title}</h3>
        {project.description && (
          <p className="m3-tile-desc line-clamp-3">{project.description}</p>
        )}
        {(project.stipend || project.duration) && (
          <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
            {project.stipend && (
              <div className="whitespace-nowrap">
                <dt className="m3-label-medium text-on-surface-variant">Stipend</dt>
                <dd className="m3-body-medium text-on-surface">{project.stipend}</dd>
              </div>
            )}
            {project.duration && (
              <div className="whitespace-nowrap">
                <dt className="m3-label-medium text-on-surface-variant">Duration</dt>
                <dd className="m3-body-medium text-on-surface">{project.duration}</dd>
              </div>
            )}
          </dl>
        )}
        <div className="mt-auto pt-5">
          {onAction ? (
            <button type="button" onClick={onAction} className="m3-btn m3-btn-filled">
              {label}
            </button>
          ) : (
            <Link href={href} className="m3-btn m3-btn-tonal">
              {label}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default PastelProjectCard;
