import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { buildToolJsonLd, serializeJsonLd } from "@/lib/json/seo";
import ToolHeader from "@/components/tools/json/ToolHeader";
import JsonFormatterTool from "@/components/tools/json/JsonFormatterTool";
import FormatterContent, { formatterFaq } from "@/components/tools/json/FormatterContent";
import RelatedTools from "@/components/tools/json/RelatedTools";

const TITLE = "JSON Formatter Online - Format & Beautify JSON | Sufian Fareed";
const DESCRIPTION =
  "Free online JSON Formatter to format, beautify, minify and validate JSON data. Fast, simple and developer-friendly JSON formatting tool.";
const PATH = "/tools/json-formatter";

export const metadata = {
  title: { absolute: TITLE }, // already contains the site name, so skip the layout template
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "website", url: PATH, title: TITLE, description: DESCRIPTION, siteName: siteConfig.name },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function JsonFormatterPage() {
  const jsonLd = buildToolJsonLd({ name: "JSON Formatter", slug: "json-formatter", description: DESCRIPTION, faq: formatterFaq });

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />

      <ToolHeader
        eyebrow="// tools / json-formatter"
        title="JSON Formatter"
        intro="Paste your JSON, choose an indent, and get clean, readable output in one click. You can also minify it, copy the result or download it as a .json file. Everything runs in your browser, so your data is never uploaded."
      >
        <p className="json-crosslink">
          Only need to check the syntax? Try the <Link href="/tools/json-validator">JSON Validator</Link>.
        </p>
      </ToolHeader>

      <section className="json-tool-section" aria-label="JSON Formatter tool">
        <div className="section-inner">
          <JsonFormatterTool />
        </div>
      </section>

      <FormatterContent />
      <RelatedTools currentSlug="json-formatter" />
    </main>
  );
}
