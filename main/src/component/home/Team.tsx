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
    <section id="team" className="pt-16 md:pt-24">
      <Reveal>
        <h2 className="m3-section-title">The people behind IshvaraX</h2>
        <p className="m3-label-large mt-3 text-tertiary">Our team</p>
      </Reveal>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m, i) => (
          <Reveal as="article" key={m.id} delay={i * 60} className="m3-tile">
            <div className="m3-tile-body flex-row items-center gap-4">
              {m.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.photo}
                  alt={m.name}
                  loading="lazy"
                  decoding="async"
                  className="h-14 w-14 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="m3-avatar h-14 w-14 text-base">
                  {initials(m.name)}
                </span>
              )}
              <div className="min-w-0">
                <p className="m3-title-medium truncate text-on-surface">{m.name}</p>
                <p className="m3-body-medium truncate text-on-surface-variant">{m.role}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default Team;
