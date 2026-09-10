import { processSteps } from "@/data/process";
import ScrollReveal from "./ScrollReveal";

export default function HowIWork() {
  return (
    <section className="process" id="process">
      <div className="section-inner">
        <ScrollReveal>
          <p className="section-eyebrow">{"// how I work"}</p>
          <h2 className="section-title">A straightforward process.</h2>
        </ScrollReveal>

        <ScrollReveal className="process__grid">
          {processSteps.map((item) => (
            <div className="process-card" key={item.step}>
              <span className="process-card__step">{item.step}</span>
              <h3 className="process-card__title">{item.title}</h3>
              <p className="process-card__desc">{item.description}</p>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
