"use client";

import Link from "next/link";
import Reveal from "@/component/ui/Reveal";
import { useAuth } from "@/context/AuthContext";

type Step = {
  title: string;
  body: string;
  cta?: { label: string; href: string };
};

const STEPS: Step[] = [
  {
    title: "Create your account",
    body: "Sign up in a minute and tell us the skills you love to build with.",
    cta: { label: "Join now", href: "/register" },
  },
  {
    title: "Explore projects & learnings",
    body: "Browse real open projects and study materials organised by topic.",
    cta: { label: "Browse projects", href: "/projects" },
  },
  {
    title: "Apply with your work",
    body: "Share your links and apply to the projects that match your skills.",
    cta: { label: "See openings", href: "/#projects" },
  },
  {
    title: "Build with the community",
    body: "Collaborate with people who love to code and ship real things together.",
  },
  {
    title: "Learn & grow",
    body: "Level up on real work, then help others do the same.",
    cta: { label: "Open learnings", href: "/learnings" },
  },
];

// Step markers cycle through the brand colours.
const MARKERS = [
  "var(--brand-blue)",
  "var(--brand-orange)",
  "var(--brand-amber-deep)",
  "var(--brand-cyan-deep)",
  "var(--brand-blue)",
];

/** Vertical zig-zag roadmap with fade-up-on-scroll animations. */
const Roadmap = () => {
  const { user } = useAuth();

  // The "how it works" onboarding is only relevant to logged-out visitors.
  if (user) return null;

  return (
    <section
      id="roadmap"
      className="bg-[var(--background)] px-4 py-20 md:px-8 md:py-32"
    >
      <div className="mx-auto w-full max-w-7xl">
        <Reveal className="text-center">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            How it works
          </span>
          <h2 className="mt-4 text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-[var(--foreground)]">
            Your journey, step by step
          </h2>
        </Reveal>

        {/* Timeline */}
        <div className="relative mt-20">
          {/* Vertical line: left on mobile, centred on desktop */}
          <span
            aria-hidden
            className="absolute top-3 bottom-3 w-0.5 rounded-full bg-gradient-to-b from-[var(--accent)] via-[var(--ink)] to-transparent left-[21px] md:left-1/2 md:-translate-x-1/2"
          />

          <ol className="flex flex-col gap-14 md:gap-20">
            {STEPS.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <li key={step.title} className="relative">
                  {/* Numbered marker sitting on the line */}
                  <span
                    className="absolute top-1 z-10 flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-[var(--on-accent)] ring-8 ring-[var(--background)] left-0 md:left-1/2 md:-translate-x-1/2"
                    style={{ background: MARKERS[i % MARKERS.length] }}
                  >
                    {i + 1}
                  </span>

                  <div
                    className={`pl-20 md:w-1/2 md:pl-0 ${
                      isLeft ? "md:pr-16" : "md:ml-auto md:pl-16"
                    }`}
                  >
                    <Reveal
                      as="article"
                      delay={i * 60}
                      className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 transition-colors hover:border-[var(--accent)]"
                    >
                      <h3 className="text-xl font-medium tracking-[-0.01em] text-[var(--foreground)] md:text-2xl">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-base text-[var(--muted)] md:text-lg">
                        {step.body}
                      </p>
                      {step.cta && (
                        <Link
                          href={step.cta.href}
                          className="g-pill g-pill-primary mt-6"
                        >
                          {step.cta.label}
                          <span aria-hidden>→</span>
                        </Link>
                      )}
                    </Reveal>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
