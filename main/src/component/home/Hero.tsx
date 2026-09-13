"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import content from "@/app/site-content.json";
import { useAuth } from "@/context/AuthContext";

const { hero, site } = content;

type Dash = {
  x: number; // % of container
  y: number; // % of container
  rot: number; // deg
  len: number; // px
  op: number;
  color: string;
};

// Brand colours, cycled across the spiral arms.
const DASH_COLORS = [
  "var(--brand-blue)",
  "var(--brand-cyan)",
  "var(--brand-amber)",
  "var(--brand-orange)",
];

// Deterministic PRNG so server and client render identical particles.
const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

/** Builds a spiral "vortex" of short dashes swirling around the centre. */
const buildVortex = (count: number): Dash[] => {
  const rand = seeded(42);
  const out: Dash[] = [];
  const arms = 5;
  for (let i = 0; i < count; i++) {
    // Radius biased towards the outer band so the centre stays clear for text.
    const t = Math.pow(rand(), 0.6);
    const r = 16 + t * 34; // 16% → 50% of container
    const arm = i % arms;
    const twist = t * Math.PI * 2.2; // how far the spiral arms wind
    const angle =
      (arm / arms) * Math.PI * 2 + twist + (rand() - 0.5) * 0.9;
    const x = 50 + Math.cos(angle) * r;
    const y = 50 + Math.sin(angle) * r;
    // Dash lies roughly tangent to the spiral.
    const rot = (angle * 180) / Math.PI + 90 + 35 + (rand() - 0.5) * 30;
    // Round so server and client serialise identical style strings.
    const r2 = (n: number) => Math.round(n * 100) / 100;
    out.push({
      x: r2(x),
      y: r2(y),
      rot: r2(rot),
      len: r2(3 + rand() * 6),
      op: r2(0.55 + rand() * 0.45),
      color: DASH_COLORS[arm % DASH_COLORS.length],
    });
  }
  return out;
};

/** Full-screen opening hero with a particle vortex, brand mark, headline and CTAs. */
const Hero = () => {
  const { user } = useAuth();
  const [y, setY] = useState(0);

  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashes = useMemo(() => buildVortex(520), []);

  const p = Math.min(y / 420, 1); // scroll progress 0 → 1
  const scale = 1 - p * 0.25;
  const opacity = 1 - p * 0.9;

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden bg-[var(--background)] px-4 text-center md:min-h-screen"
    >
      {/* Particle vortex — rotates gently as you scroll */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[140vmin] max-h-[1400px] w-[140vmin] max-w-[1400px] transition-transform duration-300 ease-out"
        style={{ transform: `translate(-50%,-50%) rotate(${y * 0.03}deg)` }}
      >
        {dashes.map((d, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: `${d.len}px`,
              height: "2.5px",
              opacity: d.op,
              background: d.color,
              transform: `translate(-50%,-50%) rotate(${d.rot}deg)`,
            }}
          />
        ))}
      </div>

      <div
        className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-4"
        style={{ transform: `scale(${scale})`, opacity }}
      >
        {/* Brand mark */}
        <span className="inline-flex items-center gap-2 text-lg font-medium text-[var(--foreground)]">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path d="M3 20L12 3l9 17" stroke="var(--brand-blue)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 20l4-8 4 8" stroke="var(--brand-purple)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {site.name}
        </span>

        {/* Headline */}
        <h1 className="mt-6 max-w-5xl text-[clamp(2.4rem,7vw,6.25rem)] font-medium leading-[1.02] tracking-[-0.03em] text-[var(--foreground)]">
          {hero.headingLead}
          <br />
          with a community that ships
        </h1>

        <p className="mt-6 max-w-xl text-base text-[var(--muted)] md:text-lg">
          {hero.subtitle}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {!user && (
            <Link href={hero.cta.href} className="g-pill g-pill-primary px-6 py-3">
              {hero.cta.label}
            </Link>
          )}
          <Link href={hero.ctaSecondary.href} className="g-pill g-pill-soft px-6 py-3">
            {hero.ctaSecondary.label}
          </Link>
        </div>
      </div>

      {/* Bouncing scroll hint */}
      <a
        href="#roadmap"
        aria-label="Scroll to roadmap"
        className="absolute bottom-6 left-1/2 flex h-11 w-11 -translate-x-1/2 animate-bounce items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
};

export default Hero;