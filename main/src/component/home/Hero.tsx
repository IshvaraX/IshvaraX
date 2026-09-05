"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import content from "@/app/site-content.json";

const { hero } = content;

// The wordmark is typed out in English, then Hindi, on a loop.
const PHRASES = ["IshvaraX", "ईश्वरा"];

/** Full-screen opening hero whose wordmark shrinks and fades as you scroll. */
const Hero = () => {
  const [y, setY] = useState(0);

  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Typewriter effect cycling through the phrases.
  const [text, setText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = PHRASES[phraseIdx];
    if (!deleting && text === full) {
      const t = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % PHRASES.length);
      return;
    }
    const t = setTimeout(
      () =>
        setText((cur) =>
          deleting ? cur.slice(0, -1) : full.slice(0, cur.length + 1)
        ),
      deleting ? 70 : 140
    );
    return () => clearTimeout(t);
  }, [text, deleting, phraseIdx]);

  const p = Math.min(y / 420, 1); // scroll progress 0 → 1
  const scale = 1 - p * 0.4;
  const opacity = 1 - p * 0.9;

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden border-b border-[var(--border)] px-4 text-center md:min-h-screen"
    >
      {/* Decorative flat shapes (no images) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute left-[8%] top-[18%] h-24 w-24 rounded-full bg-[#dcaa89] opacity-80" />
        <span className="absolute right-[10%] top-[24%] h-16 w-16 rotate-12 rounded-xl bg-[#d6794d] opacity-80" />
        <span className="absolute bottom-[20%] left-[16%] h-14 w-14 rounded-lg bg-[#c35627] opacity-80" />
        <span className="absolute bottom-[24%] right-[14%] h-20 w-20 rounded-full bg-[#bfb9b5] opacity-70" />
      </div>

      <div
        className="relative flex flex-col items-center"
        style={{ transform: `scale(${scale})`, opacity }}
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--on-accent)]">
          Learn · Build · Ship
        </span>
        {/* Ruled "paper" lines behind the animated wordmark */}
        <div className="relative my-12 flex w-[min(94vw,58rem)] items-center justify-center md:my-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 inset-y-[15%] flex flex-col justify-between"
          >
            <span className="h-px w-full bg-[var(--border)]" />
            <span className="w-full border-t border-dashed border-[var(--border)]" />
            <span className="h-px w-full bg-[var(--border)]" />
          </div>
          <h1
            className="relative min-h-[1.1em] text-center font-medium leading-[0.9] tracking-tight text-[clamp(4.5rem,18vw,13.5rem)]"
            style={{ fontFamily: "var(--font-sans), 'Poppins', sans-serif" }}
          >
            {text}
            <span className="animate-pulse font-normal text-[var(--accent)]">
              |
            </span>
          </h1>
        </div>
        <p className="mt-5 max-w-xl text-base text-[var(--muted)] md:text-lg">
          {hero.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href={hero.cta.href} className="g-btn g-btn-primary px-7 py-3 text-sm">
            {hero.cta.label}
          </Link>
          <Link href={hero.ctaSecondary.href} className="g-btn px-7 py-3 text-sm">
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