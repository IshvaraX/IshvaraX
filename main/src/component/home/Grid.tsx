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
    <section id={id} className="px-4 py-14 md:px-8 md:py-20 border-t-2 border-current">
      <div className="w-full lg:w-[65%] mx-auto">
        {/* Main Container with brutal border */}
        <div
          className="p-8 md:p-12 border-2"
          style={{
            backgroundColor: `hsl(${hue}, 30%, 25%)`,
            borderColor: `hsl(${hue}, 100%, 50%)`,
          }}
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Left Column - Icon & Title */}
            <div className="flex flex-col gap-6">
              {icon && (
                <div className="flex items-center justify-start">
                  <div
                    className="p-3 border-2"
                    style={{
                      backgroundColor: `hsl(${hue}, 100%, 50%)`,
                      borderColor: `hsl(${hue}, 100%, 50%)`,
                      color: `hsl(${hue}, 30%, 25%)`,
                    }}
                  >
                    {icon}
                  </div>
                </div>
              )}

              <h2 className="text-xl md:text-2xl font-bold leading-tight uppercase tracking-tight" style={{
                color: `hsl(${hue}, 100%, 70%)`,
              }}>
                {sectionTitle}
              </h2>
            </div>

            {/* Right Column - Cards Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cards.map((card, index) => {
                const Wrapper = card.href ? "a" : "div";
                const wrapperProps = card.href ? { href: card.href, target: "_blank" } : {};
                const cardBg = `hsl(${hue}, 50%, 4%)`;

                return (
                  <Wrapper
                    key={index}
                    {...wrapperProps}
                    className="group p-4 border-2 hover:shadow-none transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      backgroundColor: cardBg,
                      borderColor: `hsl(${hue}, 75%, 50%)`,
                    }}
                  >
                    <p
                      className="text-xs font-bold tracking-widest mb-2 uppercase brutal-heading"
                      style={{
                        color: `hsl(${hue}, 100%, 60%)`,
                      }}
                    >
                      {card.label}
                    </p>

                    <h3 className="text-base font-bold mb-3 text-white uppercase">
                      {card.title}
                    </h3>

                    <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                      {card.description}
                    </p>

                    {card.href && (
                      <div
                        className="mt-4 text-xs font-bold flex items-center opacity-70 group-hover:opacity-100 transition-opacity uppercase tracking-wide"
                        style={{
                          color: `hsl(${hue}, 100%, 60%)`,
                        }}
                      >
                        Learn more →
                      </div>
                    )}
                  </Wrapper>
                );
              })}
            </div>
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
