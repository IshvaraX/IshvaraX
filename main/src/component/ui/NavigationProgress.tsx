"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { apiActivity } from "@/lib/api";

/** Only show the bar for backend work that takes longer than this (avoids flicker). */
const API_SHOW_DELAY = 250;

/**
 * Thin top-of-page progress bar. Appears when an internal link is clicked or
 * when the backend is busy for more than a moment; completes once the route
 * has rendered and all API requests have settled. Self-contained, no deps.
 */
const NavigationProgress = () => {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const trickle = useRef<ReturnType<typeof setInterval> | null>(null);
  const navPending = useRef(false);
  const apiPending = useRef(false);
  const apiDelay = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const stopTrickle = () => {
    if (trickle.current) {
      clearInterval(trickle.current);
      trickle.current = null;
    }
  };

  const clearHideTimers = () => {
    hideTimers.current.forEach(clearTimeout);
    hideTimers.current = [];
  };

  const start = () => {
    clearHideTimers();
    if (trickle.current) return;
    setVisible(true);
    setProgress(10);
    trickle.current = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + Math.random() * 12));
    }, 300);
  };

  const finish = () => {
    if (navPending.current || apiPending.current) return;
    stopTrickle();
    setProgress(100);
    clearHideTimers();
    hideTimers.current = [
      setTimeout(() => setVisible(false), 300),
      setTimeout(() => setProgress(0), 600),
    ];
  };

  // Route rendered: navigation is done.
  useEffect(() => {
    navPending.current = false;
    finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Backend activity: show after a short delay, finish when everything settles.
  useEffect(() => {
    const unsubscribe = apiActivity.subscribe((pending) => {
      if (pending > 0) {
        if (apiPending.current || apiDelay.current) return;
        apiDelay.current = setTimeout(() => {
          apiDelay.current = null;
          apiPending.current = true;
          start();
        }, API_SHOW_DELAY);
      } else {
        if (apiDelay.current) {
          clearTimeout(apiDelay.current);
          apiDelay.current = null;
        }
        if (apiPending.current) {
          apiPending.current = false;
          finish();
        }
      }
    });
    return () => {
      unsubscribe();
      if (apiDelay.current) clearTimeout(apiDelay.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start the bar when an internal navigation begins.
  useEffect(() => {
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

      navPending.current = true;
      start();
      // Query-only navigations don't change `pathname`; don't leave the bar hanging.
      hideTimers.current.push(
        setTimeout(() => {
          navPending.current = false;
          finish();
        }, 8000)
      );
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      stopTrickle();
      clearHideTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] transition-opacity duration-200"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* M3 linear progress indicator: 4px primary bar on a container track */}
      <div className="h-1 w-full bg-primary-container">
        <div
          className="h-full rounded-r-full bg-primary transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default NavigationProgress;
