"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppShell from "@/component/nav/AppShell";
import { useAuth } from "@/context/AuthContext";
import { learningsApi, type LearningDTO } from "@/lib/api";
import { getYouTube } from "@/lib/youtube";
import CourseMedia from "@/component/ui/CourseMedia";

/** Study materials with a sidebar + sub-nav and inline video players. */
const LearningsPage = () => {
  const { user, isReady } = useAuth();
  const [items, setItems] = useState<LearningDTO[]>([]);
  const [loading, setLoading] = useState(true);
  // Filter: "section" or "section|category", or null for all.
  const [filter, setFilter] = useState<string | null>(null);
  const [menu, setMenu] = useState<string | null>(null); // open dropdown section

  const filterSection = filter ? filter.split("|")[0] : null;
  const filterCat = filter && filter.includes("|") ? filter.split("|")[1] : null;

  useEffect(() => {
    learningsApi
      .list()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const bySection: Record<string, Record<string, LearningDTO[]>> = {};
    for (const it of items) {
      (bySection[it.section] ??= {})[it.category] ??= [];
      bySection[it.section][it.category].push(it);
    }
    return bySection;
  }, [items]);

  const sections = Object.keys(grouped);

  if (isReady && !user) {
    return (
      <AppShell>
        <main className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="g-heading-lg !text-3xl">Learnings</h1>
          <p className="g-body mt-3">
            Log in with your IshvaraX account to access the study materials.
          </p>
          <Link href="/login" className="g-btn g-btn-primary mt-6 inline-flex">
            Log in
          </Link>
        </main>
      </AppShell>
    );
  }

  const chipStyle = (active: boolean) => ({
    background: active ? "var(--accent)" : "var(--surface)",
    color: active ? "var(--on-accent)" : "var(--foreground)",
    borderColor: active ? "var(--accent)" : "var(--border)",
  });

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <span className="text-sm font-bold uppercase tracking-wider text-[var(--accent-2)]">
          // learnings
        </span>
        <h1 className="g-heading-lg mt-2 !text-3xl md:!text-5xl">
          Study materials
        </h1>
        <p className="g-body mt-3 max-w-2xl">
          Courses, syllabus, notes and video playlists — organized by section
          and category.
        </p>

        {/* Sub-nav: a dropdown of categories per section */}
        {!loading && sections.length > 0 && (
          <div className="sticky top-16 z-30 mt-8 flex flex-wrap items-center gap-2 border-y border-[var(--border)] bg-[var(--background)]/95 py-3 backdrop-blur">
            <button
              type="button"
              onClick={() => setFilter(null)}
              className="rounded-full border px-4 py-1.5 text-sm font-semibold"
              style={chipStyle(filter === null)}
            >
              All
            </button>
            {sections.map((section) => (
              <div key={section} className="relative">
                <button
                  type="button"
                  onClick={() => setMenu(menu === section ? null : section)}
                  className="inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold"
                  style={chipStyle(filterSection === section)}
                >
                  {section}
                  <span aria-hidden className="text-xs">
                    ▾
                  </span>
                </button>
                {menu === section && (
                  <div className="absolute left-0 top-full z-40 mt-1 min-w-[12rem] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setFilter(section);
                        setMenu(null);
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-[var(--background)]"
                    >
                      All {section}
                    </button>
                    {Object.keys(grouped[section]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setFilter(`${section}|${cat}`);
                          setMenu(null);
                        }}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[var(--background)]"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {menu && (
          <div
            className="fixed inset-0 z-20"
            onClick={() => setMenu(null)}
            aria-hidden
          />
        )}

        {loading ? (
          <p className="g-body mt-10">Loading…</p>
        ) : sections.length === 0 ? (
          <p className="g-body mt-10">No materials have been added yet.</p>
        ) : (
          <div className="mt-8 flex gap-8">
            {/* Sidebar */}
            <aside className="sticky top-32 hidden h-fit w-56 shrink-0 md:block">
              <nav className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => setFilter(null)}
                  className={`text-left text-sm font-bold uppercase tracking-wide ${
                    filter === null
                      ? "text-[var(--accent-2)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  All materials
                </button>
                {sections.map((section) => (
                  <div key={section}>
                    <button
                      type="button"
                      onClick={() => setFilter(section)}
                      className={`text-left text-sm font-bold ${
                        filterSection === section
                          ? "text-[var(--accent-2)]"
                          : "text-[var(--foreground)]"
                      }`}
                    >
                      {section}
                    </button>
                    <ul className="mt-1.5 flex flex-col gap-1 border-l border-[var(--border)] pl-3">
                      {Object.keys(grouped[section]).map((cat) => {
                        const key = `${section}|${cat}`;
                        return (
                          <li key={cat}>
                            <button
                              type="button"
                              onClick={() => setFilter(key)}
                              className={`text-left text-[0.85rem] ${
                                filter === key
                                  ? "font-semibold text-[var(--accent-2)]"
                                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
                              }`}
                            >
                              {cat}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-12">
                {Object.entries(grouped)
                  .filter(([s]) => !filterSection || filterSection === s)
                  .map(([section, cats]) => (
                    <section key={section}>
                      <h2 className="g-heading-sm mb-4 text-lg">{section}</h2>
                      <div className="flex flex-col gap-8">
                        {Object.entries(cats)
                          .filter(([c]) => !filterCat || filterCat === c)
                          .map(([cat, list]) => (
                            <div key={cat}>
                              <h3 className="mb-3 inline-flex rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-sm font-semibold">
                                {cat}
                              </h3>
                              <ul className="flex flex-col gap-3">
                                {list.map((it) => {
                                  const { playlistId } = getYouTube(it.link);
                                  return (
                                    <li
                                      key={it.id}
                                      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
                                    >
                                      <div className="mb-3 flex flex-wrap items-center gap-2">
                                        <span className="font-medium">
                                          {playlistId && (
                                            <span className="mr-1 text-[var(--muted)]">
                                              ☰
                                            </span>
                                          )}
                                          {it.title}
                                        </span>
                                      </div>
                                      <CourseMedia link={it.link} title={it.title} />
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ))}
                      </div>
                    </section>
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
};

export default LearningsPage;
