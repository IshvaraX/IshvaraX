import content from "@/app/site-content.json";
import Reveal from "@/component/ui/Reveal";

const { pinaka } = content;

/** Brief, transparent note that PINAKA is a separate research side project. */
const Pinaka = () => (
  <section id="pinaka" className="pt-16 md:pt-24">
    <Reveal>
      <h2 className="m3-section-title">{pinaka.heading}</h2>
    </Reveal>
    <Reveal className="m3-tile mt-8">
      <div className="m3-tile-body">
        <p className="m3-label-large text-tertiary">{pinaka.label}</p>
        <p className="m3-tile-desc max-w-3xl">{pinaka.body}</p>
      </div>
    </Reveal>
  </section>
);

export default Pinaka;
