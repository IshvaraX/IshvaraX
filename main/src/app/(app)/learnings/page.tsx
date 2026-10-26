"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MdCheck, MdExpandMore, MdPlaylistPlay } from "react-icons/md";
import PagePanel from "@/component/ui/PagePanel";
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
      <PagePanel narrow className="flex flex-col items-center justify-center text-center">
          <h1 className="m3-headline-large">Learnings</h1>
          <p className="m3-body-large mt-3 text-on-surface-variant">
            Log in with your IshvaraX account to access the study materials.
          </p>
          <Link href="/login" className="m3-btn m3-btn-filled mt-6">
            Log in
          </Link>
      </PagePanel>
    );
  }

  return (
    <PagePanel>
        <span className="m3-label-large text-primary">
          Learnings
        </span>
        <h1 className="m3-section-title mt-2">
          Study materials
        </h1>
        <p className="m3-body-large mt-3 max-w-2xl text-on-surface-variant">
          Courses, syllabus, notes and video playlists — organized by section
          and category.
        </p>

        {/* Sub-nav: filter chips with a category menu per section */}
        {!loading && sections.length > 0 && (
          <div className="sticky top-16 z-30 mt-8 flex flex-wrap items-center gap-2 border-y border-outline-variant bg-panel/95 py-3 backdrop-blur lg:top-0">
            <button
              type="button"
              aria-pressed={filter === null}
              onClick={() => setFilter(null)}
              className="m3-chip"
            >
              {filter === null && <MdCheck aria-hidden />}
              All
            </button>
            {sections.map((section) => (
              <div key={section} className="relative">
                <button
                  type="button"
                  aria-pressed={filterSection === section}
                  aria-haspopup="menu"
                  aria-expanded={menu === section}
                  onClick={() => setMenu(menu === section ? null : section)}
                  className="m3-chip pr-2"
                >
                  {filterSection === section && <MdCheck aria-hidden />}
                  {section}
                  <MdExpandMore aria-hidden className="!ml-0" />
                </button>
                {menu === section && (
                  <div role="menu" className="m3-menu absolute left-0 top-full z-40 mt-1 min-w-[12rem]">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setFilter(section);
                        setMenu(null);
                      }}
                      className="m3-menu-item"
                    >
                      All {section}
                    </button>
                    {Object.keys(grouped[section]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setFilter(`${section}|${cat}`);
                          setMenu(null);
                        }}
                        className="m3-menu-item font-normal"
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
            <aside className="sticky top-32 hidden h-fit w-56 shrink-0 md:block lg:top-20">
              <nav className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => setFilter(null)}
                  className={`m3-label-large text-left ${
                    filter === null
                      ? "text-primary"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  All materials
                </button>
                {sections.map((section) => (
                  <div key={section}>
                    <button
                      type="button"
                      onClick={() => setFilter(section)}
                      className={`m3-title-small text-left ${
                        filterSection === section
                          ? "text-primary"
                          : "text-on-surface"
                      }`}
                    >
                      {section}
                    </button>
                    <ul className="mt-1.5 flex flex-col gap-1 border-l border-outline-variant pl-3">
                      {Object.keys(grouped[section]).map((cat) => {
                        const key = `${section}|${cat}`;
                        return (
                          <li key={cat}>
                            <button
                              type="button"
                              onClick={() => setFilter(key)}
                              className={`m3-body-medium text-left ${
                                filter === key
                                  ? "font-medium text-primary"
                                  : "text-on-surface-variant hover:text-on-surface"
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
                      <h2 className="m3-title-large mb-4">{section}</h2>
                      <div className="flex flex-col gap-8">
                        {Object.entries(cats)
                          .filter(([c]) => !filterCat || filterCat === c)
                          .map(([cat, list]) => (
                            <div key={cat}>
                              <h3 className="m3-chip m3-chip-tonal mb-3">
                                {cat}
                              </h3>
                              <ul className="flex flex-col gap-3">
                                {list.map((it) => {
                                  const { playlistId } = getYouTube(it.link);
                                  return (
                                    <li
                                      key={it.id}
                                      className="m3-card-outlined p-4"
                                    >
                                      <div className="mb-3 flex flex-wrap items-center gap-2">
                                        <span className="m3-title-medium inline-flex items-center gap-1.5">
                                          {playlistId && (
                                            <MdPlaylistPlay
                                              aria-hidden
                                              className="h-4 w-4 text-on-surface-variant"
                                            />
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
    </PagePanel>
  );
};

export default LearningsPage;
