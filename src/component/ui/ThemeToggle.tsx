"use client";

import { useEffect, useState } from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

export const THEME_KEY = "ix-theme";
type Theme = "light" | "dark";

const resolveTheme = (): Theme => {
  const forced = document.documentElement.getAttribute("data-theme");
  if (forced === "light" || forced === "dark") return forced;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

/** Light / dark switch (bottom of the rail, like m3.material.io). Persists the choice. */
const ThemeToggle = ({ className = "" }: { className?: string }) => {
  // null until mounted so server and first client render match.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => setTheme(resolveTheme()), []);

  const toggle = () => {
    const next: Theme = (theme ?? resolveTheme()) === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage unavailable */
    }
    setTheme(next);
  };

  const dark = theme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={`m3-icon-btn m3-icon-btn-outlined ${className}`}
    >
      {dark ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
    </button>
  );
};

export default ThemeToggle;
