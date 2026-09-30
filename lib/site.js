export const siteConfig = {
  name: "Sufian Fareed",
  title: "Sufian Fareed — WordPress, Shopify & Next.js Developer",
  description:
    "Sufian Fareed is a full-stack web developer with 7+ years of experience building WordPress, Shopify, and Next.js websites for clients in Pakistan and abroad.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  wpApiUrl: process.env.NEXT_PUBLIC_WP_API_URL || "https://purple-mole-964641.hostingersite.com",
  keywords: [
    "WordPress Developer",
    "Shopify Developer",
    "Next.js Developer",
    "React Developer",
    "Full Stack Web Developer",
    "CMS Developer",
    "Custom Website Development",
  ],
  yearsExperience: "7+",
  whatsappNumber: "923153111900",
  whatsappMessage:
    "Hi Sufian, I visited your portfolio and would like to discuss a project with you.",
  socials: {
    github: "https://github.com/SufianFareed",
    linkedin: "https://linkedin.com/in/sufianfareed",
    youtube: "https://youtube.com/@sufianfareed",
  },
};

// Builds a wa.me link with a custom, contextual pre-filled message.
export function getWhatsAppUrl(message) {
  const text = message || siteConfig.whatsappMessage;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
