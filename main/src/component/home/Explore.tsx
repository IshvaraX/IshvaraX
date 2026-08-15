import Link from "next/link";
import content from "@/app/site-content.json";
import Reveal from "@/component/ui/Reveal";

const { explore } = content;

const eyebrowColors = [
  "var(--accent)",
  "var(--status-open)",
  "var(--accent-2)",
  "var(--status-closed)",
];

const Explore = () => {
  return (
    <section
      id="explore"
      className="border-t border-[var(--border)] px-4 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <span className="text-sm font-semibold text-[var(--accent-2)]">
            {explore.label}
          </span>
          <h2 className="g-heading-lg mt-2 !text-3xl md:!text-5xl">
            {explore.heading}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {explore.cards.map((card, i) => (
            <Reveal key={card.title} delay={(i % 2) * 90}>
              <Link
                href={card.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-colors hover:border-[color-mix(in_srgb,var(--accent)_45%,var(--border))]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt=""
                  className="aspect-[16/9] w-full object-cover"
                />
                <div className="p-6">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: eyebrowColors[i % eyebrowColors.length] }}
                  >
                    {card.eyebrow}
                  </span>
                  <h3 className="g-heading-sm mt-1">{card.title}</h3>
                  <p className="mt-2 text-[var(--muted)]">{card.description}</p>
                  <span className="g-link mt-4">
                    Learn more <span className="arrow">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Explore;
