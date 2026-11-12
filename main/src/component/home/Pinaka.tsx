import content from "@/app/site-content.json";
import Reveal from "@/component/ui/Reveal";

const { pinaka } = content;

const Pinaka = () => (
  <section id="pinaka" className="pt-20 md:pt-28">
    <Reveal
      as="aside"
      className="grid gap-3 rounded-3xl border border-outline-variant px-6 py-6 md:grid-cols-[14rem_1fr] md:gap-8 md:px-8"
    >
      <div>
        <h2 className="m3-headline-small">{pinaka.heading}</h2>
        <p className="m3-label-large mt-1 text-on-surface-variant">{pinaka.label}</p>
      </div>
      <p className="m3-body-medium max-w-prose text-on-surface-variant md:self-center">{pinaka.body}</p>
    </Reveal>
  </section>
);

export default Pinaka;
