"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms for staggered reveals. */
  delay?: number;
  as?: "div" | "section" | "article" | "li";
  style?: React.CSSProperties;
};

/** One observer shared by every Reveal on the page instead of one per element. */
type RevealCallback = (visible: boolean) => void;
let sharedObserver: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, RevealCallback>();

function observe(el: Element, cb: RevealCallback) {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) callbacks.get(entry.target)?.(entry.isIntersecting);
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
  }
  callbacks.set(el, cb);
  sharedObserver.observe(el);
  return () => {
    callbacks.delete(el);
    sharedObserver?.unobserve(el);
  };
}

/** Reveals its children with a fade/slide-up every time they enter the viewport. */
const Reveal = ({ children, className, delay = 0, as = "div", style }: RevealProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Toggle on each enter/leave so the animation repeats, not just on load.
    return observe(el, setShown);
  }, []);

  // ElementType keeps TS from expanding every intrinsic element's props.
  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "reveal-in" : ""} ${className ?? ""}`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
