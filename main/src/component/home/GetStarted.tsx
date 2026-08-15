import Link from "next/link";
import content from "@/app/site-content.json";
import Reveal from "@/component/ui/Reveal";

const { getStarted } = content;

const GetStarted = () => {
  return (
    <section
      id="get-started"
      className="border-t border-[var(--border)] px-4 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <span className="text-sm font-semibold text-[var(--accent)]">
            {getStarted.label}
          </span>
          <h2 className="g-heading-lg mt-2 !text-3xl md:!text-5xl">
            {getStarted.heading}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {getStarted.cards.map((card, i) => (
            <Reveal
              key={card.title}
              as="article"
              delay={i * 90}
              className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
            >
              <div className="p-6">
                <h3 className="g-heading-sm">{card.title}</h3>
                <p className="mt-2 text-[var(--muted)]">{card.description}</p>
                <Link href={card.href} className="g-link mt-4">
                  {card.cta} <span className="arrow">→</span>
                </Link>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt=""
                className="mt-auto aspect-[16/10] w-full object-cover"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetStarted;
