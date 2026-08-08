import Link from "next/link";

const HeroArt = () => (
  <svg
    viewBox="0 0 400 360"
    className="w-full h-auto max-w-md mx-auto"
    role="img"
    aria-label="IshvaraX illustration"
  >
    <circle cx="300" cy="70" r="55" fill="rgb(var(--g-yellow))" opacity="0.9" />
    <circle cx="90" cy="250" r="70" fill="rgb(var(--g-blue))" opacity="0.9" />
    <rect
      x="150"
      y="130"
      width="150"
      height="150"
      rx="6"
      fill="rgb(var(--g-red))"
      opacity="0.9"
    />
    <path
      d="M60 90 h120 a6 6 0 0 1 6 6 v60 a6 6 0 0 1 -6 6 h-120 a6 6 0 0 1 -6 -6 v-60 a6 6 0 0 1 6 -6 z"
      fill="rgb(var(--background-rgb))"
      stroke="rgb(var(--foreground-rgb))"
      strokeWidth="3"
    />
    <text
      x="120"
      y="160"
      textAnchor="middle"
      fontSize="34"
      fontFamily="monospace"
      fill="rgb(var(--foreground-rgb))"
    >
      &lt;/&gt;
    </text>
    <circle cx="300" cy="300" r="26" fill="rgb(var(--g-green))" />
  </svg>
);

const Hero = () => {
  return (
    <section
      id="hero"
      className="px-4 sm:px-6 pt-28 pb-16 md:pt-32 md:pb-24"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-2">
        <div>
          <span className="g-eyebrow g-eyebrow-blue block mb-4">
            A community for people who love to code
          </span>
          <h1 className="g-heading-xl mb-5">
            IshvaraX
            <span className="block text-[rgb(var(--g-blue))]">
              Uplifting coders
            </span>
          </h1>
          <p className="g-body text-base md:text-lg max-w-xl mb-8">
            IshvaraX is a community built to uplift people who love to code — a
            place to learn, collaborate, and grow together.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register" className="g-btn g-btn-primary">
              Join the community
            </Link>
            <Link href="/projects" className="g-btn">
              Browse projects
            </Link>
          </div>
        </div>

        <div className="order-first md:order-last">
          <HeroArt />
        </div>
      </div>
    </section>
  );
};

export default Hero;