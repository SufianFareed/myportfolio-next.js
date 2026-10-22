import Link from "next/link";

// Page heading used by the developer tools (same markup as the other tool pages).
export default function ToolHeader({ eyebrow, title, intro, children }) {
  return (
    <section className="page-hero json-hero">
      <div className="section-inner">
        <Link href="/tools" className="tool-back">← All tools</Link>
        <p className="section-eyebrow">{eyebrow}</p>
        <h1 className="section-title">{title}</h1>
        <p className="page-hero__lede">{intro}</p>
        {children}
      </div>
    </section>
  );
}
