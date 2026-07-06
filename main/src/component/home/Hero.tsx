const HeroColumn = ({
  title,
  description,
  tag,
}: {
  title: string;
  description: string;
  tag: string;
}) => {
  return (
    <div className="gdm-card">
      <div className="gdm-card-media flex items-center justify-center">
        <span className="gdm-eyebrow">{tag}</span>
      </div>
      <div className="gdm-card-body">
        <h2 className="gdm-heading-md mb-2">{title}</h2>
        <p className="gdm-body mb-4">{description}</p>
        <a href="#" className="gdm-link">
          Learn more <span className="arrow">→</span>
        </a>
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
    },
    {
      title: "Technology",
      description:
        "Developing PINAKA platform for brainwave prediction and neural activity analysis using AI models.",
      tag: "PINAKA Platform",
    },
    {
      title: "Impact",
      description:
        "Ethical AI development and public service initiatives through Jan-Seva for accessible technology.",
      tag: "Jan-Seva AI",
    },
  ];

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 pb-16"
    >
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="gdm-eyebrow block mb-4">
            Building the future of neural AI
          </span>
          <h1 className="gdm-heading-xl mb-5">IshvaraX</h1>
          <p className="gdm-body text-base md:text-lg max-w-2xl mx-auto">
            Decoding human consciousness through Brain-Computer Interfaces and
            Predictive AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {columns.map((column, index) => (
            <HeroColumn
              key={index}
              title={column.title}
              description={column.description}
              tag={column.tag}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;