// `category` must be one of: "wordpress" | "shopify" | "nextjs" | "other-cms"
// `badge` should honestly reflect the work: "Client Project", "Personal Project",
// or "Concept Project" — never label a demo as client work.
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
  // ---------- WordPress ----------
  {
    id: 1,
    title: "Paraphrasing Matters",
    category: "wordpress",
    badge: "Client Project",
    description:
      "A human paraphrasing and content-writing service site built on WordPress with Elementor, with an order flow designed to convert visitors into paying customers.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=60",
    technologies: ["WordPress", "Elementor"],
    liveUrl: "https://www.paraphrasingmatters.com/",
    githubUrl: "",
    featured: true,
  },
  {
    id: 2,
    title: "Paraphrasing UK",
    category: "wordpress",
    badge: "Client Project",
    description:
      "A UK-focused paraphrasing and essay-rewriting service built on WordPress with WPBakery, including an order system and a sample-work section.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=60",
    technologies: ["WordPress", "WPBakery"],
    liveUrl: "https://paraphrasing.co.uk/",
    githubUrl: "",
    featured: false,
  },
  {
    id: 3,
    title: "Passion Pursuit",
    category: "wordpress",
    badge: "Client Project",
    description:
      "A marketing site for an IT consultancy and co-working space, covering their services, stats, and client testimonials.",
    image:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=60",
    technologies: ["WordPress", "Elementor"],
    liveUrl: "https://passion-pursuit.com/",
    githubUrl: "",
    featured: false,
  },
  {
    id: 4,
    title: "Aadyaa Communications",
    category: "wordpress",
    badge: "Client Project",
    description:
      "A branding and marketing agency website covering their services, from communication design to film marketing and celebrity management.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=60",
    technologies: ["WordPress", "Elementor"],
    liveUrl: "https://aadyaacommunications.com/",
    githubUrl: "",
    featured: false,
  },
  {
    id: 5,
    title: "Private Health Compare",
    category: "wordpress",
    badge: "Client Project",
    description:
      "A UK private health insurance comparison site built on WordPress, helping visitors compare providers and plans.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=60",
    technologies: ["WordPress", "Elementor"],
    liveUrl: "https://privatehealthcompare.co.uk/",
    githubUrl: "",
    featured: false,
  },
  {
    id: 6,
    title: "Southern Executive Transport",
    category: "wordpress",
    badge: "Client Project",
    description:
      "A booking-focused website for an executive transportation service, built on WordPress to make quote requests and bookings straightforward.",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=60",
    technologies: ["WordPress", "Elementor"],
    liveUrl: "https://southernexecutivetransport.com/",
    githubUrl: "",
    featured: false,
  },
  {
    id: 7,
    title: "APEX Procurement Solutions",
    category: "wordpress",
    badge: "Client Project",
    description:
      "A corporate site for a Houston-based procurement and project management firm, covering their services and the industries they serve.",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=60",
    technologies: ["WordPress", "Elementor"],
    liveUrl: "https://solutionswithapex.com/",
    githubUrl: "",
    featured: false,
  },
  {
    id: 8,
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
    featured: false,
  },
  {
    id: 9,
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
    featured: false,
  },

  // ---------- Shopify ----------
  {
    id: 10,
    title: "Orbit Deals.pk",
    category: "shopify",
    badge: "Client Project",
    description:
      "A Shopify beauty and skincare store for the Pakistani market, with product collections organized by category and brand.",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=60",
    technologies: ["Shopify", "Shopify Liquid"],
    liveUrl: "https://orbitdeals.pk/",
    githubUrl: "",
    featured: true,
  },
  {
    id: 11,
    title: "She She Boutique",
    category: "shopify",
    badge: "Client Project",
    description:
      "An established Shopify fashion boutique that I customized and maintain, keeping the storefront updated and running smoothly.",
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=60",
    technologies: ["Shopify", "Shopify Liquid"],
    liveUrl: "https://she-she.com/",
    githubUrl: "",
    featured: false,
  },

  // ---------- Next.js / React ----------
  {
    id: 12,
    title: "Gains by Brains",
    category: "nextjs",
    badge: "Client Project",
    description:
      "The marketing site for a fitness and nutrition coaching app with 120,000+ downloads, covering programs, pricing, and sign-up.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=60",
    technologies: ["Next.js", "React"],
    liveUrl: "https://gainsbybrains.com/",
    githubUrl: "",
    featured: true,
  },
  {
    id: 13,
    title: "DisInnova",
    category: "nextjs",
    badge: "Client Project",
    description:
      "A site for a UK governance, risk, and transformation advisory firm, covering their services, approach, and insights.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=60",
    technologies: ["React", "Next.js", "Nest.js"],
    liveUrl: "https://disinnova.com/",
    githubUrl: "",
    featured: false,
  },

  // ---------- Other CMS / Custom ----------
  {
    id: 14,
    title: "Alyssa Moreno Designs",
    category: "other-cms",
    badge: "Client Project",
    description:
      "A Squarespace portfolio site built to showcase design work with a clean, gallery-style layout.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=60",
    technologies: ["Squarespace"],
    liveUrl: "https://www.alyssamorenodesigns.com/",
    githubUrl: "",
    featured: false,
  },
  {
    id: 15,
    title: "Films by Ghostlight",
    category: "other-cms",
    badge: "Client Project",
    description:
      "A Squarespace site for a film production studio, presenting their work in a simple, visual portfolio format.",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=60",
    technologies: ["Squarespace"],
    liveUrl: "https://www.filmsbyghostlight.com/",
    githubUrl: "",
    featured: false,
  },
  {
    id: 16,
    title: "Beauty264",
    category: "other-cms",
    badge: "Client Project",
    description:
      "A Wix storefront for a beauty brand, set up with product listings and a simple checkout flow.",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=60",
    technologies: ["Wix"],
    liveUrl: "https://beauty264.wixsite.com/",
    githubUrl: "",
    featured: false,
  },
  {
    id: 17,
    title: "Fashion Factory",
    category: "other-cms",
    badge: "Client Project",
    description:
      "A Wix storefront for a fashion brand, built around clean product presentation and easy browsing.",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=60",
    technologies: ["Wix"],
    liveUrl: "https://fashionffactory.wixsite.com/",
    githubUrl: "",
    featured: false,
  },
];
