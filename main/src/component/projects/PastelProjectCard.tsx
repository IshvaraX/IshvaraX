import Link from "next/link";
import type { Project } from "@/context/ProjectsContext";
import CornerNotch from "@/component/ui/CornerNotch";

// Pastel tint + deeper brand colour for the button, chosen per project.
const PALETTE: { bg: string; btn: string }[] = [
  { bg: "#fff1d9", btn: "#e5940e" }, // amber
  { bg: "#dcfaff", btn: "#0aa9c4" }, // cyan
  { bg: "#e4ebff", btn: "#4272ff" }, // blue
  { bg: "#ffe7db", btn: "#f2662a" }, // orange
  { bg: "#fff7e6", btn: "#ff7e42" }, // amber → orange
  { bg: "#eaf6ff", btn: "#2f5ce6" }, // cyan → blue
];

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

export const pastelFor = (key: string) => PALETTE[hash(key) % PALETTE.length];
export const pastelAt = (i: number) => PALETTE[i % PALETTE.length];

type Props = {
  project: Project;
  href?: string;
  label?: string;
  className?: string;
  /** Colour behind the card, so the corner notch blends in. */
  notchColor?: string;
  /** When provided, the CTA is a button that calls this instead of a link. */
  onAction?: () => void;
  /** Show the open/closed status pill. */
  showStatus?: boolean;
};

/** Flat pastel tile with the title on top and a pill CTA hanging off the corner. */
const PastelProjectCard = ({
  project,
  href = `/projects?id=${project.id}`,
  label = "Learn more",
  className = "",
  notchColor = "var(--background)",
  onAction,
  showStatus = false,
}: Props) => {
  const { bg, btn } = pastelFor(project.id);
  const isOpen = project.status === "open";
  const ctaClass =
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90";
  return (
    <article
      className={`relative flex min-h-[15rem] flex-col rounded-2xl p-6 pb-14 ${className}`}
      style={{ background: bg }}
    >
      {showStatus && (
        <span
          className="mb-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-widest text-white"
          style={{
            background: isOpen ? "var(--status-open)" : "var(--status-closed)",
          }}
        >
          {isOpen ? "Open" : "Closed"}
        </span>
      )}
      <h3 className="text-xl font-medium leading-snug tracking-[-0.01em] text-[#14161c] md:text-2xl">
        {project.title}
      </h3>
      {project.skills.length > 0 && (
        <p className="mt-2 text-sm font-medium" style={{ color: btn }}>
          {project.skills.slice(0, 3).join(" · ")}
        </p>
      )}
      {project.description && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#14161c]/75">
          {project.description}
        </p>
      )}
      {(project.stipend || project.duration) && (
        <p className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pr-28 pt-4 text-[0.8rem] font-medium text-[#14161c]/85">
          {project.stipend && (
            <span className="whitespace-nowrap">Stipend · {project.stipend}</span>
          )}
          {project.duration && (
            <span className="whitespace-nowrap">Duration · {project.duration}</span>
          )}
        </p>
      )}
      {/* CTA sits in a notch cut into the card's corner */}
      <CornerNotch surface={bg} behind={notchColor}>
        {onAction ? (
          <button
            type="button"
            onClick={onAction}
            className={ctaClass}
            style={{ background: btn }}
          >
            {label}
            <span aria-hidden>→</span>
          </button>
        ) : (
          <Link href={href} className={ctaClass} style={{ background: btn }}>
            {label}
            <span aria-hidden>→</span>
          </Link>
        )}
      </CornerNotch>
    </article>
  );
};

export default PastelProjectCard;
