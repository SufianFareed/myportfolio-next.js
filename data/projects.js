// `category` must be one of: "wordpress" | "shopify" | "nextjs" | "other-cms"
// `badge` should honestly reflect what the project is: "Client Project",
// "Personal Project", or "Concept Project" — never label a demo as client work.
// Leave `liveUrl` / `githubUrl` empty until you have a real link — the
// ProjectCard component hides those buttons automatically when empty and
// shows a "Need something similar?" WhatsApp CTA instead.

export const projectCategories = [
  { id: "all", label: "All Projects" },
  { id: "wordpress", label: "WordPress" },
  { id: "shopify", label: "Shopify" },
  { id: "nextjs", label: "Next.js / React" },
  { id: "other-cms", label: "Other CMS / Custom" },
];

export const projects = [
  {
    id: 1,
    title: "Eduker",
    category: "wordpress",
    badge: "Client Project",
    description:
      "An education and academic website built from a custom mockup, converted into a fully editable Elementor template.",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=60",
    technologies: ["WordPress", "Elementor", "Tailwind"],
    liveUrl: "",
    githubUrl: "",
    featured: true,
  },
  {
    id: 2,
    title: "Chemplink",
    category: "wordpress",
    badge: "Client Project",
    description:
      "A plumbing services website designed for fast lead conversion, built with a clean mockup-to-code workflow.",
    image:
      "https://images.unsplash.com/photo-1607472829760-9a6a5a2c2e0f?auto=format&fit=crop&w=800&q=60",
    technologies: ["WordPress", "Elementor", "CSS"],
    liveUrl: "",
    githubUrl: "",
    featured: true,
  },
];
