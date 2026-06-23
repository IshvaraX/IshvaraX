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
    <div className="space-y-4 border-2 border-zinc-900 dark:border-white p-6">
      <h2 className="text-lg font-bold text-black dark:text-white uppercase tracking-tight">
        {title}
      </h2>
      <p className="text-zinc-700 dark:text-zinc-300 text-sm font-medium leading-relaxed">{description}</p>
      <div>
        <span
          className={`inline-block px-3 py-2 text-xs font-bold uppercase tracking-widest border-2 ${tagColor}`}
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
      tagColor: "border-zinc-900 dark:border-white bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white",
    },
    {
      title: "Technology",
      description:
        "Developing PINAKA platform for brainwave prediction and neural activity analysis using AI models.",
      tag: "PINAKA Platform",
      tagColor:
        "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100",
    },
    {
      title: "Impact",
      description:
        "Ethical AI development and public service initiatives through Jan-Seva for accessible technology.",
      tag: "Jan-Seva AI",
      tagColor:
        "border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-100",
    },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 border-b-2 border-zinc-900 dark:border-white">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-12 border-2 border-zinc-900 dark:border-white p-8">
          <h1 className="text-5xl md:text-7xl font-black text-black dark:text-white mb-4 uppercase tracking-tighter">
            IshvaraX
          </h1>
          <p className="text-base text-zinc-800 dark:text-zinc-200 max-w-2xl mx-auto font-bold">
            Decoding human consciousness through Brain-Computer Interfaces and
            Predictive AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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
