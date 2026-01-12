const HeroColumn = ({
  title,
  description,
  tag,
  tagColor,
}: {
  title: string;
  description: string;
  tag: string;
  tagColor: string;
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-1xl font-semibold text-black dark:text-white">
        {title}
      </h2>
      <p className="text-zinc-300 dark:text-zinc-400 text-sm">{description}</p>
      <div>
        <span
          className={`inline-block px-3 py-1 text-xs font-medium rounded ${tagColor}`}
        >
          {tag}
        </span>
      </div>
    </div>
  );
};

const Hero = () => {
  const columns = [
    {
      title: "Research",
      description:
        "Advanced neuroscience and AI research focused on brain-computer interfaces and neural pattern analysis.",
      tag: "Neural Synthesis AI",
      tagColor: "bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200",
    },
    {
      title: "Technology",
      description:
        "Developing PINAKA platform for brainwave prediction and neural activity analysis using AI models.",
      tag: "PINAKA Platform",
      tagColor:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
    },
    {
      title: "Impact",
      description:
        "Ethical AI development and public service initiatives through Jan-Seva for accessible technology.",
      tag: "Jan-Seva AI",
      tagColor:
        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200",
    },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-4">
            IshvaraX
          </h1>
          <p className="text-m text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Decoding human consciousness through Brain-Computer Interfaces and
            Predictive AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {columns.map((column, index) => (
            <HeroColumn
              key={index}
              title={column.title}
              description={column.description}
              tag={column.tag}
              tagColor={column.tagColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
