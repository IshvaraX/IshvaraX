/**
 * Fixed, non-interactive background: a faint blueprint grid plus scattered
 * coding & time symbols for a vintage-futurist look. Positions are static to
 * avoid hydration mismatches.
 */

type Mark = {
  s: string;
  top: number; // %
  left: number; // %
  size: number; // rem
  rot: number; // deg
  op: number; // opacity
};

// Coding + time-related glyphs scattered across the viewport.
const MARKS: Mark[] = [
  { s: "</>", top: 8, left: 6, size: 1.6, rot: -8, op: 0.14 },
  { s: "{ }", top: 18, left: 82, size: 2, rot: 10, op: 0.12 },
  { s: "=>", top: 74, left: 12, size: 1.7, rot: -4, op: 0.13 },
  { s: "⏳", top: 30, left: 46, size: 1.8, rot: 6, op: 0.1 },
  { s: "const", top: 62, left: 70, size: 1.2, rot: -6, op: 0.12 },
  { s: "();", top: 44, left: 24, size: 1.5, rot: 12, op: 0.12 },
  { s: "12:00", top: 12, left: 40, size: 1.1, rot: -3, op: 0.12 },
  { s: "[]", top: 86, left: 60, size: 1.9, rot: 8, op: 0.12 },
  { s: "λ", top: 24, left: 14, size: 2.2, rot: 0, op: 0.12 },
  { s: "∴", top: 54, left: 90, size: 1.8, rot: 0, op: 0.12 },
  { s: "#!/bin", top: 92, left: 20, size: 1, rot: -5, op: 0.11 },
  { s: "⏱", top: 6, left: 68, size: 1.8, rot: 10, op: 0.12 },
  { s: "&&", top: 40, left: 58, size: 1.6, rot: -10, op: 0.12 },
  { s: "0x1F", top: 68, left: 40, size: 1.1, rot: 4, op: 0.11 },
  { s: "!=", top: 16, left: 26, size: 1.6, rot: 6, op: 0.12 },
  { s: "Σ", top: 80, left: 84, size: 2.1, rot: 0, op: 0.11 },
  { s: "23:59", top: 50, left: 8, size: 1.1, rot: -8, op: 0.12 },
  { s: "</div>", top: 34, left: 74, size: 1.1, rot: 8, op: 0.11 },
  { s: "()=>{}", top: 88, left: 40, size: 1, rot: -4, op: 0.11 },
  { s: "π", top: 58, left: 34, size: 2, rot: 0, op: 0.11 },
  { s: "⌛", top: 72, left: 92, size: 1.7, rot: 6, op: 0.11 },
  { s: "::", top: 22, left: 60, size: 1.9, rot: 0, op: 0.12 },
  { s: "~/", top: 46, left: 78, size: 1.6, rot: -6, op: 0.11 },
  { s: "∞", top: 10, left: 92, size: 2, rot: 0, op: 0.11 },
  { s: "git", top: 78, left: 30, size: 1.2, rot: 5, op: 0.11 },
  { s: "/*  */", top: 28, left: 32, size: 1.1, rot: -3, op: 0.11 },
  { s: "◷", top: 64, left: 18, size: 1.9, rot: 0, op: 0.11 },
  { s: "npm i", top: 4, left: 20, size: 1, rot: 4, op: 0.11 },
  { s: "===", top: 52, left: 52, size: 1.4, rot: -8, op: 0.11 },
  { s: "Δt", top: 84, left: 8, size: 1.6, rot: 0, op: 0.11 },
  { s: "->", top: 36, left: 6, size: 1.7, rot: 6, op: 0.12 },
  { s: "404", top: 94, left: 74, size: 1.3, rot: -5, op: 0.1 },
  { s: "τ", top: 14, left: 54, size: 2, rot: 0, op: 0.1 },
  // math
  { s: "∑", top: 20, left: 34, size: 2, rot: 0, op: 0.11 },
  { s: "∫", top: 66, left: 62, size: 2.1, rot: 0, op: 0.11 },
  { s: "√", top: 40, left: 44, size: 1.9, rot: 0, op: 0.1 },
  { s: "∂", top: 82, left: 48, size: 1.8, rot: 0, op: 0.1 },
  { s: "∇", top: 26, left: 88, size: 1.8, rot: 0, op: 0.1 },
  { s: "≈", top: 58, left: 10, size: 1.7, rot: 0, op: 0.11 },
  { s: "≠", top: 12, left: 76, size: 1.7, rot: 0, op: 0.11 },
  { s: "≤", top: 48, left: 66, size: 1.6, rot: 0, op: 0.1 },
  { s: "≥", top: 70, left: 6, size: 1.6, rot: 0, op: 0.1 },
  { s: "±", top: 34, left: 18, size: 1.8, rot: 0, op: 0.1 },
  { s: "∀", top: 88, left: 88, size: 1.8, rot: 0, op: 0.1 },
  { s: "∃", top: 6, left: 46, size: 1.7, rot: 0, op: 0.1 },
  { s: "∈", top: 76, left: 70, size: 1.7, rot: 0, op: 0.1 },
  { s: "⊕", top: 44, left: 92, size: 1.9, rot: 0, op: 0.1 },
  { s: "θ", top: 62, left: 26, size: 1.9, rot: 0, op: 0.1 },
  { s: "μ", top: 18, left: 8, size: 1.9, rot: 0, op: 0.1 },
  { s: "Ω", top: 90, left: 34, size: 1.9, rot: 0, op: 0.1 },
  { s: "φ", top: 52, left: 40, size: 1.9, rot: 0, op: 0.1 },
  { s: "≡", top: 30, left: 64, size: 1.7, rot: 0, op: 0.1 },
  { s: "∝", top: 72, left: 52, size: 1.7, rot: 0, op: 0.1 },
  // more tech / code
  { s: "sudo", top: 10, left: 30, size: 1.1, rot: 4, op: 0.1 },
  { s: "SELECT *", top: 82, left: 16, size: 1, rot: -4, op: 0.1 },
  { s: "GET /", top: 24, left: 70, size: 1.1, rot: 6, op: 0.1 },
  { s: "async", top: 56, left: 84, size: 1.1, rot: -6, op: 0.1 },
  { s: "await", top: 60, left: 46, size: 1.1, rot: 4, op: 0.1 },
  { s: "0xFF", top: 38, left: 38, size: 1.2, rot: 0, op: 0.1 },
  { s: "0b1010", top: 46, left: 14, size: 1, rot: -5, op: 0.1 },
  { s: "#include", top: 92, left: 58, size: 1, rot: 3, op: 0.1 },
  { s: "def()", top: 16, left: 92, size: 1.1, rot: -3, op: 0.1 },
  { s: "fn()", top: 68, left: 30, size: 1.2, rot: 5, op: 0.1 },
  { s: "NULL", top: 4, left: 60, size: 1.1, rot: -4, op: 0.1 },
  { s: "&ptr", top: 78, left: 44, size: 1.2, rot: 6, op: 0.1 },
  { s: "|>", top: 32, left: 6, size: 1.7, rot: 0, op: 0.11 },
  { s: "<=>", top: 86, left: 76, size: 1.4, rot: -4, op: 0.1 },
  { s: "??", top: 50, left: 30, size: 1.7, rot: 8, op: 0.1 },
  { s: "</html>", top: 22, left: 48, size: 1.1, rot: -3, op: 0.1 },
  // more time
  { s: "⏲", top: 40, left: 82, size: 1.7, rot: 0, op: 0.1 },
  { s: "09:41", top: 64, left: 76, size: 1.1, rot: 4, op: 0.1 },
  { s: "t₀", top: 28, left: 24, size: 1.7, rot: 0, op: 0.1 },
  { s: "Hz", top: 84, left: 66, size: 1.5, rot: -3, op: 0.1 },
  { s: "UTC", top: 12, left: 14, size: 1.2, rot: 5, op: 0.1 },
];

const BackgroundDecor = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
  >
    {/* Blueprint grid */}
    <svg className="absolute inset-0 h-full w-full">
      <defs>
        <pattern id="ix-grid" width="44" height="44" patternUnits="userSpaceOnUse">
          <path
            d="M44 0H0V44"
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
          />
        </pattern>
        <pattern id="ix-grid-lg" width="220" height="220" patternUnits="userSpaceOnUse">
          <path
            d="M220 0H0V220"
            fill="none"
            stroke="var(--border)"
            strokeWidth="1.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ix-grid)" opacity="0.5" />
      <rect width="100%" height="100%" fill="url(#ix-grid-lg)" opacity="0.6" />
    </svg>

    {/* Futurist crosshair / concentric motifs */}
    <svg
      className="absolute right-[6%] top-[12%] h-40 w-40 text-[var(--border)]"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="50" cy="50" r="46" />
      <circle cx="50" cy="50" r="30" />
      <circle cx="50" cy="50" r="14" />
      <path d="M50 0v100M0 50h100" strokeDasharray="4 4" />
    </svg>
    <svg
      className="absolute bottom-[10%] left-[8%] h-32 w-32 text-[var(--border)]"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
    >
      <rect x="8" y="8" width="84" height="84" strokeDasharray="6 5" />
      <path d="M50 8v84M8 50h84" />
    </svg>

    {/* Scattered coding & time symbols */}
    {MARKS.map((m, i) => (
      <span
        key={i}
        className="absolute select-none font-[family-name:var(--font-mono)] font-medium text-[var(--foreground)]"
        style={{
          top: `${m.top}%`,
          left: `${m.left}%`,
          fontSize: `${m.size}rem`,
          transform: `rotate(${m.rot}deg)`,
          opacity: m.op,
        }}
      >
        {m.s}
      </span>
    ))}
  </div>
);

export default BackgroundDecor;
