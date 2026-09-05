import content from "@/app/site-content.json";
import Reveal from "@/component/ui/Reveal";

const { pinaka } = content;

/** Brief, transparent note that PINAKA is a separate research side project. */
const Pinaka = () => (
  <section
    id="pinaka"
    className="border-t border-[var(--border)] px-4 py-20 md:px-8 md:py-32"
  >
    <div className="mx-auto w-full max-w-3xl text-center">
      <Reveal>
        <span className="text-sm font-bold uppercase tracking-wider text-[var(--status-open)]">
          {`// ${pinaka.label}`}
        </span>
        <h2 className="g-heading-lg mt-2 !text-3xl md:!text-5xl">
          {pinaka.heading}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted)]">
          {pinaka.body}
        </p>
      </Reveal>
    </div>
  </section>
);

export default Pinaka;
