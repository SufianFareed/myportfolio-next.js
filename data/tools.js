// Each tool gets its own route at /tools/<slug>. Add a new object here
// plus a matching folder at app/tools/<slug>/page.js as you build more.

export const tools = [
  {
    slug: "gig-seo-score",
    title: "Gig SEO Score",
    description:
      "Paste your Fiverr gig title and description to get an instant score, plus specific feedback on keyword placement, length, and readability.",
    category: "SEO",
    icon: "◎",
    status: "live",
  },
  {
    slug: "invoice-generator",
    title: "Invoice Generator",
    description:
      "Create professional invoices with live preview, three templates, multiple currencies, saved history, and a clean A4 PDF download.",
    category: "Business",
    icon: "▤",
    status: "live",
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    description:
      "Format, beautify and minify JSON with 2-space, 4-space or tab indentation. Clear error messages, copy and download, all in your browser.",
    category: "Developer",
    icon: "{ }",
    status: "live",
  },
  {
    slug: "json-validator",
    title: "JSON Validator",
    description:
      "Check JSON syntax and find the exact line and column of any error. Fast, private, and runs entirely in your browser.",
    category: "Developer",
    icon: "✓",
    status: "live",
  },
];
