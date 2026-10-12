export const CURRENCIES = ["PKR", "USD", "GBP", "EUR", "AED", "SAR", "CAD", "AUD", "JPY", "CNY", "INR"];

export const STATUSES = ["Draft", "Unpaid", "Paid", "Overdue"];

export const TEMPLATES = [
  { id: "modern", label: "Modern Blue", blurb: "Bold colour header" },
  { id: "minimal", label: "Minimal B&W", blurb: "Clean black and white" },
  { id: "elegant", label: "Elegant", blurb: "Refined serif style" },
];

export const ACCENT_PRESETS = [
  { name: "Blue", value: "#2563eb" },
  { name: "Navy", value: "#1e3a8a" },
  { name: "Teal", value: "#0f766e" },
  { name: "Purple", value: "#6d28d9" },
  { name: "Crimson", value: "#be123c" },
  { name: "Charcoal", value: "#374151" },
];

export const DEFAULT_ACCENT = "#2563eb";

export const STORAGE_KEYS = {
  profile: "sf-invoice:profile:v1",
  draft: "sf-invoice:draft:v1",
  history: "sf-invoice:history:v1",
};

export const SERVICE_SUGGESTIONS = [
  "WordPress Website Development",
  "Website Troubleshooting",
  "PHP Compatibility Fix",
  "WordPress Theme and Plugin Updates",
  "WooCommerce Configuration",
  "Website Maintenance",
  "React / Next.js Development",
  "Shopify Development",
  "SEO Optimization",
];

export const DEFAULT_TERMS =
  "Payment is due by the date shown above. Please use the invoice number as your payment reference.";

export const DEFAULT_THANK_YOU = "Thank you for your business!";
