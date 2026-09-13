"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Thin top-of-page progress bar that appears when an internal link is clicked
 * and completes once the new route has rendered. Self-contained, no deps.
 */
const NavigationProgress = () => {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const trickle = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTrickle = () => {
    if (trickle.current) {
      clearInterval(trickle.current);
      trickle.current = null;
    }
  };

  // Finish and hide the bar once the route actually changes.
  useEffect(() => {
    stopTrickle();
    setProgress(100);
    const hide = setTimeout(() => setVisible(false), 300);
    const reset = setTimeout(() => setProgress(0), 600);
    return () => {
      clearTimeout(hide);
      clearTimeout(reset);
    };
  }, [pathname]);

  // Start the bar when an internal navigation begins.
  useEffect(() => {
    const start = () => {
      stopTrickle();
      setVisible(true);
      setProgress(10);
      trickle.current = setInterval(() => {
        setProgress((p) => (p >= 90 ? p : p + Math.random() * 12));
      }, 300);
    };

    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      const target = anchor.getAttribute("target");
      if (target && target !== "_self") return;
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;

      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Same page (or hash on the same page) — no navigation, skip.
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      )
        return;

      start();
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      stopTrickle();
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] transition-opacity duration-200"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className="h-[3px] bg-[var(--accent)] transition-[width] duration-200 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: "0 0 10px var(--accent), 0 0 4px var(--accent)",
        }}
      />
    </div>
  );
};

export default NavigationProgress;
