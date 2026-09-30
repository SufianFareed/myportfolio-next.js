import Link from "next/link";
import GigSeoScoreTool from "@/components/tools/GigSeoScoreTool";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "Gig SEO Score — Free Fiverr Gig Checker",
  description:
    "Paste your Fiverr gig title and description to get an instant SEO score, with feedback on keyword placement, length, density, and readability.",
  alternates: { canonical: "/tools/gig-seo-score" },
};

export default function GigSeoScorePage() {
  return (
    <main>
      <section className="page-hero">
        <div className="section-inner">
          <ScrollReveal>
            <Link href="/tools" className="tool-back">← All tools</Link>
            <p className="section-eyebrow">{"// tools / gig-seo-score"}</p>
            <h1 className="section-title">How well is your gig written?</h1>
            <p className="page-hero__lede">
              Paste your gig title, description, and focus keyword below.
              This checks the same things a buyer&apos;s search — and
              Fiverr&apos;s own ranking — tends to reward: keyword
              placement, length, density, and readability.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="tools-list">
        <div className="section-inner">
          <ScrollReveal>
            <GigSeoScoreTool />
          </ScrollReveal>
          <p className="tool-disclaimer">Scoring runs entirely in your browser — nothing you type is sent anywhere.</p>
        </div>
      </section>
    </main>
  );
}
