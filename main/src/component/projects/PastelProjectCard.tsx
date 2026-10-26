import Link from "next/link";
import type { CSSProperties } from "react";
import { MdOutlineWork } from "react-icons/md";
import type { Project } from "@/context/ProjectsContext";

/** M3 tonal tile: container colour, its "on" colour, and the matching role for the CTA. */
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

/** Inline style for a tile; also exposes --pc-text for legacy `text-[var(--pc-text)]` usage. */
export const toneStyle = (tone: Tone): CSSProperties =>
  ({ background: tone.bg, color: tone.fg, "--pc-text": tone.fg }) as CSSProperties;

type Props = {
  project: Project;
  href?: string;
  label?: string;
  className?: string;
  /** When provided, the CTA is a button that calls this instead of a link. */
  onAction?: () => void;
  /** Show the open/closed status pill. */
  showStatus?: boolean;
};

/** Project tile: tonal media block on top, title + description, action at the bottom. */
const PastelProjectCard = ({
  project,
  href = `/projects?id=${project.id}`,
  label = "Learn more",
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
          <p className="m3-label-medium mt-1 flex flex-wrap gap-x-4 gap-y-1 text-on-surface-variant">
            {project.stipend && (
              <span className="whitespace-nowrap">Stipend · {project.stipend}</span>
            )}
            {project.duration && (
              <span className="whitespace-nowrap">Duration · {project.duration}</span>
            )}
          </p>
        )}
        <div className="mt-auto pt-5">
          {onAction ? (
            <button type="button" onClick={onAction} className="m3-btn m3-btn-filled">
              {label}
              <span aria-hidden>→</span>
            </button>
          ) : (
            <Link href={href} className="m3-btn m3-btn-tonal">
              {label}
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default PastelProjectCard;
