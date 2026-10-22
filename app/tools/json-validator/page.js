import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { buildToolJsonLd, serializeJsonLd } from "@/lib/json/seo";
import ToolHeader from "@/components/tools/json/ToolHeader";
import JsonValidatorTool from "@/components/tools/json/JsonValidatorTool";
import ValidatorContent, { validatorFaq } from "@/components/tools/json/ValidatorContent";
import RelatedTools from "@/components/tools/json/RelatedTools";

const TITLE = "JSON Validator Online - Validate JSON Syntax | Sufian Fareed";
const DESCRIPTION =
  "Free online JSON Validator to check JSON syntax, find formatting errors and validate JSON data quickly.";
const PATH = "/tools/json-validator";

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "website", url: PATH, title: TITLE, description: DESCRIPTION, siteName: siteConfig.name },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function JsonValidatorPage() {
  const jsonLd = buildToolJsonLd({ name: "JSON Validator", slug: "json-validator", description: DESCRIPTION, faq: validatorFaq });

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />

      <ToolHeader
        eyebrow="// tools / json-validator"
        title="JSON Validator"
        intro="Paste your JSON and check it instantly. If something is wrong, the validator tells you what, and shows the line and column so you can fix it quickly. Validation runs in your browser, so your data is never uploaded."
      >
        <p className="json-crosslink">
          Want clean indentation or a minified copy? Use the <Link href="/tools/json-formatter">JSON Formatter</Link>.
        </p>
      </ToolHeader>

      <section className="json-tool-section" aria-label="JSON Validator tool">
        <div className="section-inner">
          <JsonValidatorTool />
        </div>
      </section>

      <ValidatorContent />
      <RelatedTools currentSlug="json-validator" />
    </main>
  );
}
