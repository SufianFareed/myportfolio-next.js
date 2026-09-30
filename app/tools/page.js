import Link from "next/link";
import { tools } from "@/data/tools";
import { siteConfig } from "@/lib/site";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "Free Tools",
  description: "Small, free tools I've built to help with day-to-day freelance and web development work.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="section-inner">
          <ScrollReveal>
            <p className="section-eyebrow">{"// tools"}</p>
            <h1 className="section-title">Free tools.</h1>
            <p className="page-hero__lede">
              Small utilities I&apos;ve built along the way — for myself and
              for other freelancers. Everything here runs in your browser;
              nothing you type gets sent anywhere.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="tools-list">
        <div className="section-inner">
          <ScrollReveal className="tools-grid">
            {tools.map((tool) => (
              <Link href={`/tools/${tool.slug}`} className="tool-card" key={tool.slug}>
                <div className="tool-card__icon">{tool.icon}</div>
                <span className="tool-card__category">{tool.category}</span>
                <h2 className="tool-card__title">{tool.title}</h2>
                <p className="tool-card__desc">{tool.description}</p>
                <span className="tool-card__cta">Open tool →</span>
              </Link>
            ))}
          </ScrollReveal>

          {tools.length === 0 && (
            <p className="work__empty">More tools are on the way — check back soon.</p>
          )}
        </div>
      </section>
    </main>
  );
}
