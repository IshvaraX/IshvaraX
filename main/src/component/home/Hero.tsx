"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useProjects } from "@/context/ProjectsContext";
import content from "@/app/site-content.json";

const { hero } = content;

// Pick a random card colour within a hue range (white text stays readable).
const HUE_MIN = 205; // blue
const HUE_MAX = 340; // through indigo/purple to pink
const randomCardColor = () => {
  const hue = Math.floor(HUE_MIN + Math.random() * (HUE_MAX - HUE_MIN));
  return { bg: `hsl(${hue} 52% 42%)`, fg: "#ffffff" };
};

const Hero = () => {
  const { projects } = useProjects();
  const open = projects.filter((p) => p.status === "open");

  // One random colour per project, stable across re-renders (matches marquee copies).
  const ids = open.map((p) => p.id).join(",");
  const colorMap = useMemo(() => {
    const map: Record<string, { bg: string; fg: string }> = {};
    for (const p of open) map[p.id] = randomCardColor();
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);

  // Each row shows all open projects, rotated so the three rows differ.
  const rotate = <T,>(arr: T[], n: number) =>
    arr.length ? arr.slice(n % arr.length).concat(arr.slice(0, n % arr.length)) : arr;
  const rows = [0, 1, 2].map((r) => rotate(open, r));

  return (
    <section
      id="hero"
      className="flex min-h-[calc(100dvh-4rem)] items-center border-b border-[var(--border)] px-4 py-8 sm:px-6 md:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {hero.headingLead}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-[var(--muted)] md:text-lg">
            {hero.subtitle}
          </p>
        </div>

        {open.length > 0 ? (
          <div className="flex flex-col gap-4">
            {rows.map((row, r) =>
              row.length === 0 ? null : (
                <div
                  key={r}
                  className="g-marquee-wrap flex justify-center overflow-hidden"
                >
                  <div
                    className={`g-marquee ${r === 1 ? "g-marquee--reverse" : ""}`}
                  >
                    {[...row, ...row].map((p, i) => {
                      const c = colorMap[p.id];
                      return (
                        <a
                          key={`${p.id}-${r}-${i}`}
                          href="#projects"
                          aria-hidden={i >= row.length}
                          className="block shrink-0"
                        >
                          <div
                            className="flex min-h-[104px] w-[220px] flex-col justify-between rounded-2xl p-4"
                            style={{ background: c.bg, color: c.fg }}
                          >
                            <span className="text-[0.7rem] font-semibold uppercase tracking-widest opacity-80">
                              {p.skills[0] ?? "Open"}
                            </span>
                            <div>
                              <span className="block text-base font-semibold leading-snug">
                                {p.title}
                              </span>
                              {p.duration && (
                                <span className="mt-1 block text-xs opacity-80">
                                  {p.duration}
                                </span>
                              )}
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
            <p className="text-[var(--muted)]">
              No open projects right now — check back soon.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href={hero.cta.href} className="g-btn g-btn-primary px-7 py-3">
            {hero.cta.label}
          </Link>
          <Link href={hero.ctaSecondary.href} className="g-btn px-7 py-3">
            {hero.ctaSecondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;