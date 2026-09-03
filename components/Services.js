import { services } from "@/data/services";
import ScrollReveal from "./ScrollReveal";

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="section-inner">
        <ScrollReveal>
          <p className="section-eyebrow">{"// 05 — services.ts"}</p>
          <h2 className="section-title">How I can help.</h2>
        </ScrollReveal>

        <ScrollReveal className="services__grid">
          {services.map((service) => (
            <div className="service-card" key={service.title}>
              <div className="service-card__icon">{service.icon}</div>
              <h3 className="service-card__title">{service.title}</h3>
              <p className="service-card__desc">{service.description}</p>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
