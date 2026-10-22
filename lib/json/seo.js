import { siteConfig } from "@/lib/site";

// Structured data for a tool page: the app itself, its FAQ, and breadcrumbs.
// Shared by the JSON Formatter and Validator so they stay consistent.
export function buildToolJsonLd({ name, slug, description, faq }) {
  const url = `${siteConfig.url}/tools/${slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name,
        url,
        description,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        author: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Tools", item: `${siteConfig.url}/tools` },
          { "@type": "ListItem", position: 3, name, item: url },
        ],
      },
    ],
  };
}

// "<" is escaped so the JSON can never close the <script> tag early.
export const serializeJsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");
