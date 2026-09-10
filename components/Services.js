import { services } from "@/data/services";
import { getWhatsAppUrl } from "@/lib/site";
import ScrollReveal from "./ScrollReveal";

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="section-inner">
        <ScrollReveal>
          <p className="section-eyebrow">{"// services"}</p>
          <h2 className="section-title">How I can help.</h2>
        </ScrollReveal>

        <ScrollReveal className="services__grid">
          {services.map((service) => (
            <div className="service-card" key={service.title}>
              <div className="service-card__icon">{service.icon}</div>
              <h3 className="service-card__title">{service.title}</h3>
              <p className="service-card__desc">{service.description}</p>
              <a
                href={getWhatsAppUrl(service.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="service-card__cta"
              >
                Let&apos;s talk about your project →
              </a>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
