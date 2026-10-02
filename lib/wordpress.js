import { siteConfig } from "@/lib/site";

// Thin helper around the WordPress REST API so the headless blog can be
// swapped to the real domain later by only changing NEXT_PUBLIC_WP_API_URL.
// Every function fails soft (returns [] / null) instead of throwing, so a
// slow or temporarily-down WordPress install never breaks the portfolio.

const API_BASE = `${siteConfig.wpApiUrl}/wp-json/wp/v2`;

// Every WordPress fetch is tagged "posts" so a new or edited post can be
// pushed live instantly via /api/revalidate (see that route + the
// functions.php snippet in the README), instead of waiting out the clock.
// The 5-minute revalidate is just a safety net for whenever the webhook
// isn't set up or misses a post.
export async function getPosts({ perPage = 12 } = {}) {
  try {
    const res = await fetch(`${API_BASE}/posts?_embed&per_page=${perPage}`, {
      next: { revalidate: 300, tags: ["posts"] },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch WordPress posts:", err);
    return [];
  }
}

export async function getPostBySlug(slug) {
  try {
    const res = await fetch(`${API_BASE}/posts?slug=${encodeURIComponent(slug)}&_embed`, {
      next: { revalidate: 300, tags: ["posts"] },
    });
    if (!res.ok) return null;
    const posts = await res.json();
    return posts[0] || null;
  } catch (err) {
    console.error("Failed to fetch WordPress post:", err);
    return null;
  }
}

export function getFeaturedImage(post) {
  return post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
}

export function stripHtml(html) {
  return (html || "").replace(/<[^>]*>/g, "").trim();
}

export function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
