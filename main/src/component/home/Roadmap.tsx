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

const MARKERS = [
  { bg: "var(--md-sys-color-primary)", fg: "var(--md-sys-color-on-primary)" },
  { bg: "var(--md-sys-color-secondary)", fg: "var(--md-sys-color-on-secondary)" },
  { bg: "var(--md-sys-color-tertiary)", fg: "var(--md-sys-color-on-tertiary)" },
  { bg: "var(--md-extended-color-amber)", fg: "var(--md-extended-color-on-amber)" },
];

const Roadmap = () => {
  const { user } = useAuth();

  if (user) return null;

  return (
    <section id="roadmap" className="pt-16 md:pt-24">
      <Reveal>
        <h2 className="m3-section-title">How it works</h2>
        <p className="m3-body-large mt-3 max-w-2xl text-on-surface-variant md:text-lg md:leading-7">
          Your journey, step by step — from your first sign-in to shipping real
          work with the community.
        </p>
      </Reveal>

      <ol className="mt-8 grid gap-6 md:grid-cols-2">
        {STEPS.map((step, i) => {
          const marker = MARKERS[i % MARKERS.length];
          return (
            <Reveal key={step.title} as="li" delay={i * 60} className="m3-tile is-interactive">
              <div className="m3-tile-body">
                <span
                  className="m3-label-large mb-3 flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ background: marker.bg, color: marker.fg }}
                >
                  {i + 1}
                </span>
                <h3 className="m3-tile-title">{step.title}</h3>
                <p className="m3-tile-desc">{step.body}</p>
                {step.cta && (
                  <Link href={step.cta.href} className="m3-btn m3-btn-tonal mt-5 self-start">
                    {step.cta.label}
                    <span aria-hidden>→</span>
                  </Link>
                )}
              </div>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
};

export default Roadmap;
