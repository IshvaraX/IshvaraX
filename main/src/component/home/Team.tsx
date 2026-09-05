"use client";

import { useEffect, useState } from "react";
import Reveal from "@/component/ui/Reveal";
import { membersApi, type MemberDTO } from "@/lib/api";

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** Home section: organisation members and their roles (managed by admin). */
const Team = () => {
  const [members, setMembers] = useState<MemberDTO[]>([]);

  useEffect(() => {
    membersApi
      .list()
      .then(setMembers)
      .catch(() => {});
  }, []);

  if (members.length === 0) return null;

  return (
    <section
      id="team"
      className="border-t border-[var(--border)] px-4 py-20 md:px-8 md:py-32"
    >
      <div className="mx-auto w-full max-w-5xl">
        <Reveal className="text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-[var(--accent-2)]">
            {"// our team"}
          </span>
          <h2 className="g-heading-lg mt-2 !text-3xl md:!text-5xl">
            The people behind IshvaraX
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m, i) => (
            <Reveal
              as="article"
              key={m.id}
              delay={i * 60}
              className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              {m.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.photo}
                  alt={m.name}
                  className="h-12 w-12 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-extrabold text-[var(--on-accent)]">
                  {initials(m.name)}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate font-bold">{m.name}</p>
                <p className="truncate text-sm text-[var(--muted)]">{m.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
