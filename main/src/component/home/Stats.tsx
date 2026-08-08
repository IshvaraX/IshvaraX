const stats = [
  { value: "Community", label: "For people who code" },
  { value: "Learn", label: "Collaborate & grow" },
  { value: "PINAKA", label: "Separate side project" },
  { value: "Open", label: "Anyone can join" },
];

const Stats = () => {
  return (
    <section id="about" className="px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="g-contained g-contained-blue p-6 md:p-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="g-label mb-3">About</span>
              <h2 className="g-heading-lg mb-4">What is IshvaraX?</h2>
              <p className="g-body text-base">
                IshvaraX is a community focused on the upliftment of people who
                love to code — a place to learn, collaborate, and grow together.
                Separately, we also run PINAKA, an independent research side
                project of ours that is unrelated to this community mission.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-8">
              {stats.map((stat, i) => {
                const accents = [
                  "text-[rgb(var(--g-blue))]",
                  "text-[rgb(var(--g-red))]",
                  "text-[rgb(var(--g-yellow))]",
                  "text-[rgb(var(--g-green))]",
                ];
                return (
                  <div key={stat.label}>
                    <div
                      className={`text-3xl md:text-4xl font-medium ${accents[i % accents.length]}`}
                    >
                      {stat.value}
                    </div>
                    <div className="g-body text-[0.85rem] mt-1">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
