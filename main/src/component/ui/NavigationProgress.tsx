"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { apiActivity } from "@/lib/api";

const API_SHOW_DELAY = 250;

const NavigationProgress = () => {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const trickle = useRef<ReturnType<typeof setInterval> | null>(null);
  const navPending = useRef(false);
  const apiPending = useRef(false);
  const apiDelay = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const stopTrickle = useCallback(() => {
    if (trickle.current) {
      clearInterval(trickle.current);
      trickle.current = null;
    }
  }, []);

  const clearHideTimers = useCallback(() => {
    hideTimers.current.forEach(clearTimeout);
    hideTimers.current = [];
  }, []);

  const start = useCallback(() => {
    clearHideTimers();
    if (trickle.current) return;
    setVisible(true);
    setProgress(10);
    trickle.current = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + Math.random() * 12));
    }, 300);
  }, [clearHideTimers]);

  const finish = useCallback(() => {
    if (navPending.current || apiPending.current) return;
    stopTrickle();
    setProgress(100);
    clearHideTimers();
    hideTimers.current = [
      setTimeout(() => setVisible(false), 300),
      setTimeout(() => setProgress(0), 600),
    ];
  }, [stopTrickle, clearHideTimers]);

  useEffect(() => {
    navPending.current = false;
    finish();
  }, [pathname, finish]);

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
  }, [start, finish]);

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
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      )
        return;

      navPending.current = true;
      start();
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
  }, [start, finish, stopTrickle, clearHideTimers]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] transition-opacity duration-200"
      style={{ opacity: visible ? 1 : 0 }}
    >
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
