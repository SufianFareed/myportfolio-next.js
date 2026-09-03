// Skills are grouped by category so the Skills component can render them
// in order of professional focus: CMS & Ecommerce first, then modern
// JavaScript, then backend/additional tooling.
//
// `primary: true` marks the core skills — these get the highlighted
// "accent" pill style so they visually stand out from the rest.

export const skillCategories = [
  {
    title: "CMS & Ecommerce",
    skills: [
      { name: "WordPress", primary: true },
      { name: "Shopify", primary: true },
      { name: "Elementor", primary: true },
      { name: "WooCommerce", primary: true },
      { name: "Shopify Liquid", primary: false },
      { name: "Custom CMS Development", primary: false },
    ],
  },
  {
    title: "Modern Web Development",
    skills: [
      { name: "Next.js", primary: true },
      { name: "React.js", primary: true },
      { name: "JavaScript", primary: false },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", primary: false },
      { name: "Nest.js", primary: false },
      { name: "PHP", primary: false },
    ],
  },
  {
    title: "Additional",
    skills: [
      { name: "Angular.js", primary: false },
      { name: "HTML", primary: false },
      { name: "CSS", primary: false },
    ],
  },
];
