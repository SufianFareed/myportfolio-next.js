// `category` must be one of: "wordpress" | "shopify" | "nextjs"
// Add new projects here — the Projects component and filter tabs
// pick them up automatically, no other code changes needed.

export const projectCategories = [
  { id: "all", label: "All Projects" },
  { id: "wordpress", label: "WordPress" },
  { id: "shopify", label: "Shopify" },
  { id: "nextjs", label: "Next.js / Custom" },
];

export const projects = [
  {
    id: 1,
    title: "Eduker",
    category: "wordpress",
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
    description:
      "A plumbing services website designed for fast lead conversion, built with a clean mockup-to-code workflow.",
    image:
      "https://images.unsplash.com/photo-1607472829760-9a6a5a2c2e0f?auto=format&fit=crop&w=800&q=60",
    technologies: ["WordPress", "Elementor", "CSS"],
    liveUrl: "",
    githubUrl: "",
    featured: false,
  },
  {
    id: 3,
    title: "Marketplace App",
    category: "nextjs",
    description:
      "An OLX-style classifieds marketplace with Android, iOS, and admin panel apps, scoped and priced end to end.",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=60",
    technologies: ["React Native", "Node.js", "Admin Panel"],
    liveUrl: "",
    githubUrl: "",
    featured: true,
  },
  {
    id: 4,
    title: "AI-Powered Business Site",
    category: "nextjs",
    description:
      "A business website with AI-assisted content and smarter on-site search, built for speed and simple upkeep.",
    image:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=800&q=60",
    technologies: ["Next.js", "AI Tools", "JavaScript"],
    liveUrl: "",
    githubUrl: "",
    featured: false,
  },
  {
    id: 5,
    title: "E-Commerce Store",
    category: "shopify",
    description:
      "A Shopify storefront with custom sections and checkout tuning, focused on conversion and load speed.",
    image:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=60",
    technologies: ["Shopify", "Shopify Liquid", "CSS"],
    liveUrl: "",
    githubUrl: "",
    featured: true,
  },
  {
    id: 6,
    title: "SaaS Dashboard",
    category: "nextjs",
    description:
      "A React and Node.js dashboard for tracking operational data, built with reusable components throughout.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=60",
    technologies: ["React", "Nest.js", "Charts"],
    liveUrl: "",
    githubUrl: "",
    featured: false,
  },
];
