"use client";

type SectionCard = {
  label: string;
  title: string;
  description: string;
  href?: string;
};

type SectionGridProps = {
  icon?: React.ReactNode;
  sectionTitle: string;
  sectionIndex?: string;
  cards: SectionCard[];
  id?: string;
};

const SectionGrid = ({
  icon,
  sectionTitle,
  sectionIndex,
  cards,
  id,
}: SectionGridProps) => {
  return (
    <section
      id={id}
      className="px-4 py-16 md:px-8 md:py-24 border-t border-[rgb(var(--border-rgb))]"
    >
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          {/* Left Column - Icon & Title */}
          <div className="flex flex-col gap-4">
            {sectionIndex && (
              <span className="gdm-eyebrow">{sectionIndex}</span>
            )}

            {icon && (
              <div className="w-fit p-2.5 rounded-full bg-[rgb(var(--surface-rgb))] text-[rgb(var(--foreground-rgb))]">
                {icon}
              </div>
            )}

            <h2 className="gdm-heading-xl text-2xl md:text-3xl">
              {sectionTitle}
            </h2>
          </div>

          {/* Right Column - Cards Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {cards.map((card, index) => {
              const Wrapper = card.href ? "a" : "div";
              const wrapperProps = card.href
                ? { href: card.href, target: "_blank", rel: "noopener noreferrer" }
                : {};

              return (
                <Wrapper key={index} {...wrapperProps} className="gdm-card block">
                  <div className="gdm-card-body">
                    <p className="gdm-eyebrow mb-2">{card.label}</p>

                    <h3 className="gdm-heading-md mb-2 text-base">
                      {card.title}
                    </h3>

                    <p className="gdm-body">{card.description}</p>

                    {card.href && (
                      <div className="gdm-link mt-4">
                        Learn more <span className="arrow">→</span>
                      </div>
                    )}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionGrid;