import Card, { type CardData } from "@/component/ui/Card";

const accents = ["g-icon-blue", "g-icon-red", "g-icon-yellow", "g-icon-green"];
const contained = [
  "g-contained-blue",
  "g-contained-red",
  "g-contained-yellow",
  "g-contained-green",
];

type SectionGridProps = {
  icon?: React.ReactNode;
  sectionTitle: string;
  sectionIndex?: string;
  cards: CardData[];
  id?: string;
  accentIndex?: number;
};

const SectionGrid = ({
  icon,
  sectionTitle,
  sectionIndex,
  cards,
  id,
  accentIndex = 0,
}: SectionGridProps) => {
  return (
    <section id={id} className="px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto w-full max-w-6xl">
        <div
          className={`g-contained ${contained[accentIndex % contained.length]} p-6 md:p-12`}
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Left Column - Icon & Title */}
            <div className="flex flex-col gap-4">
              {sectionIndex && <span className="g-label">{sectionIndex}</span>}

              {icon && (
                <div
                  className={`g-icon ${accents[accentIndex % accents.length]}`}
                >
                  {icon}
                </div>
              )}

              <h2 className="gdm-heading-xl text-2xl md:text-3xl">
                {sectionTitle}
              </h2>
            </div>

            {/* Right Column - Cards Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {cards.map((card, index) => (
                <Card key={index} {...card} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionGrid;