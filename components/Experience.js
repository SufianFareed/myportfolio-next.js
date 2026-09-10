import { experience } from "@/data/experience";
import ScrollReveal from "./ScrollReveal";

export default function Experience() {
  return (
    <section className="experience" id="experience">
      <div className="section-inner">
        <ScrollReveal>
          <p className="section-eyebrow">{"// experience"}</p>
          <h2 className="section-title">Where I&apos;ve spent my time.</h2>
        </ScrollReveal>

        <ScrollReveal className="timeline">
          <div className="timeline__line"></div>
          {experience.map((item) => (
            <div className="timeline__item" key={item.title}>
              <div className="timeline__dot"></div>
              <div className="timeline__card">
                <span className="timeline__date">{item.date}</span>
                <h3 className="timeline__title">{item.title}</h3>
                <p className="timeline__desc">{item.description}</p>
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
