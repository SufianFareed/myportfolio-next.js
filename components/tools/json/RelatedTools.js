import Link from "next/link";
import { tools } from "@/data/tools";

// Other tools on the site. Tools in the same category (e.g. the other JSON
// tool) come first, so this always links the Formatter and Validator together.
export default function RelatedTools({ currentSlug, heading = "Related tools" }) {
  const current = tools.find((t) => t.slug === currentSlug);
  const related = tools
    .filter((t) => t.slug !== currentSlug)
    .sort((a, b) => Number(b.category === current?.category) - Number(a.category === current?.category))
    .slice(0, 3);

  if (related.length === 0) return null;
  return (
    <section aria-labelledby="related-tools-heading" className="json-related">
      <div className="section-inner">
        <h2 id="related-tools-heading" className="json-related__title">{heading}</h2>
        <div className="tools-grid">
          {related.map((tool) => (
            <Link href={`/tools/${tool.slug}`} className="tool-card" key={tool.slug}>
              <div className="tool-card__icon">{tool.icon}</div>
              <span className="tool-card__category">{tool.category}</span>
              <h3 className="tool-card__title">{tool.title}</h3>
              <p className="tool-card__desc">{tool.description}</p>
              <span className="tool-card__cta">Open tool →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
