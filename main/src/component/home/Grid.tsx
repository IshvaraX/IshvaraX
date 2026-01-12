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
  cards: SectionCard[];
  hue?: number;
  id?: string;
};

const SectionGrid = ({
  icon,
  sectionTitle,
  cards,
  hue = 160,
  id,
}: SectionGridProps) => {
  return (
    <section id={id} className="px-4 py-14 md:px-8 md:py-20">
      <div className="w-full lg:w-[65%] mx-auto">
        <div
          className="rounded-3xl p-8 md:p-12"
          style={{
            backgroundColor: `hsl(${hue}, 30%, 25%)`,
          }}
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="flex flex-col gap-6">
              {icon && (
                <div className="flex items-center justify-start">
                  <div
                    className="rounded-xl p-3"
                    style={{
                      backgroundColor: `hsl(${hue}, 65%, 10%)`,
                    }}
                  >
                    {icon}
                  </div>
                </div>
              )}

              <h2 className="text-2xl md:text-3xl font-semibold leading-tight text-white">
                {sectionTitle}
              </h2>
            </div>

            {/* Right Column - Cards Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {cards.map((card, index) => {
                const Wrapper = card.href ? "a" : "div";
                const wrapperProps = card.href ? { href: card.href } : {};
                const cardBg = `hsl(${hue}, 50%, 4%)`;

                return (
                  <Wrapper
                    key={index}
                    {...wrapperProps}
                    className="group rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    style={{
                      backgroundColor: cardBg,
                    }}
                  >
                    <p
                      className="text-xs font-medium tracking-wider mb-1"
                      style={{
                        color: `hsl(${hue}, 75%, 70%)`,
                      }}
                    >
                      {card.label.toUpperCase()}
                    </p>

                    <h3 className="text-m font-medium mb-3 text-white">
                      {card.title}
                    </h3>

                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {card.description}
                    </p>

                    {card.href && (
                      <div
                        className="mt-4 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          color: `hsl(${hue}, 100%, 70%)`,
                        }}
                      >
                        Learn more →
                      </div>
                    )}
                  </Wrapper>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionGrid;
