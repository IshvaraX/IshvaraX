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
    body: "Takes a minute. Tell us the skills you like building with so we can show you matching projects.",
    cta: { label: "Create an account", href: "/register" },
  },
  {
    title: "Explore projects and learnings",
    body: "Browse real open projects and study materials organised by topic.",
    cta: { label: "Browse projects", href: "/projects" },
  },
  {
    title: "Apply with your work",
    body: "Share links to things you've built and apply to the projects that fit.",
    cta: { label: "See open projects", href: "/#projects" },
  },
  {
    title: "Build with the community",
    body: "Work alongside people who love to code and ship real things together.",
  },
  {
    title: "Learn and grow",
    body: "Level up on real work, then help the next person do the same.",
    cta: { label: "Open learnings", href: "/learnings" },
  },
];

const Roadmap = () => {
  const { user } = useAuth();

  if (user) return null;

  return (
    <section id="roadmap" className="pt-20 md:pt-28">
      <Reveal>
        <h2 className="m3-section-title">How it works</h2>
        <p className="m3-section-lead">
          Five steps from your first sign-in to shipping real work with the community.
        </p>
      </Reveal>

      <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step, i) => (
          <Reveal
            key={step.title}
            as="li"
            delay={i * 40}
            className={`m3-tile is-interactive ${i === 0 ? "md:col-span-2" : ""}`}
          >
            <div className="m3-tile-body">
              <span className="m3-label-large mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-on-primary-container tabular-nums">
                {i + 1}
              </span>
              <h3 className="m3-tile-title">{step.title}</h3>
              <p className={`m3-tile-desc ${i === 0 ? "max-w-md" : ""}`}>{step.body}</p>
              {step.cta && (
                <Link href={step.cta.href} className="m3-btn m3-btn-tonal mt-6 self-start">
                  {step.cta.label}
                </Link>
              )}
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
};

export default Roadmap;
