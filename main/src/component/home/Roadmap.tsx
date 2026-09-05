"use client";

import Link from "next/link";
import Reveal from "@/component/ui/Reveal";

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

// One brand colour per node.
// One brand colour + readable text colour per node.
const NODES = [
  { dot: "#c35627", fg: "#ffffff" },
  { dot: "#d6794d", fg: "#ffffff" },
  { dot: "#dcaa89", fg: "#492c2e" },
  { dot: "#a8481f", fg: "#ffffff" },
];

/** Vertical zig-zag roadmap with fade-up-on-scroll animations. */
const Roadmap = () => {
  return (
    <section
      id="roadmap"
      className="border-t border-[var(--border)] px-4 py-20 md:px-8 md:py-32"
    >
      <div className="mx-auto w-full max-w-5xl">
        <Reveal className="text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-[var(--accent-2)]">
            {"// how it works"}
          </span>
          <h2 className="g-heading-lg mt-2 !text-3xl md:!text-5xl">
            Your journey, step by step
          </h2>
        </Reveal>

        {/* Timeline */}
        <div className="relative mt-24">
          {/* Vertical line: left on mobile, centred on desktop */}
          <span
            aria-hidden
            className="absolute top-3 bottom-3 w-1 rounded bg-[var(--muted)] left-[21px] md:left-1/2 md:-translate-x-1/2"
          />

          <ol className="flex flex-col gap-16 md:gap-24">
            {STEPS.map((step, i) => {
              const isLeft = i % 2 === 0;
              const node = NODES[i % NODES.length];
              return (
                <li key={step.title} className="relative">
                  {/* Numbered marker sitting on the line */}
                  <span
                    className="absolute top-1 z-10 flex h-12 w-12 items-center justify-center rounded-full text-lg font-extrabold left-0 md:left-1/2 md:-translate-x-1/2"
                    style={{ background: node.dot, color: node.fg }}
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
                      className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 transition-colors hover:bg-[var(--accent)]"
                    >
                      <h3 className="text-2xl font-extrabold group-hover:text-[var(--on-accent)]">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-lg text-[var(--muted)] group-hover:text-[var(--on-accent)]">
                        {step.body}
                      </p>
                      {step.cta && (
                        <Link
                          href={step.cta.href}
                          className="mt-5 inline-flex items-center gap-1.5 text-lg font-semibold text-[var(--accent-2)] group-hover:text-[var(--on-accent)]"
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
