import { siteConfig } from "@/lib/site";
import { getPosts } from "@/lib/wordpress";
import { tools } from "@/data/tools";

export default async function sitemap() {
  const staticRoutes = [
    { url: siteConfig.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.url}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/tools`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const toolRoutes = tools.map((tool) => ({
    url: `${siteConfig.url}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const posts = await getPosts({ perPage: 100 });
  const postRoutes = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.modified || post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...toolRoutes, ...postRoutes];
}
