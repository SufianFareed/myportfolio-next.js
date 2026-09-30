import Link from "next/link";
import Image from "next/image";
import { getPosts, getFeaturedImage, stripHtml, formatDate } from "@/lib/wordpress";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "Blog",
  description: "Notes on WordPress, Shopify, and Next.js development from real client work.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getPosts({ perPage: 12 });

  return (
    <main>
      <section className="page-hero">
        <div className="section-inner">
          <ScrollReveal>
            <p className="section-eyebrow">{"// blog"}</p>
            <h1 className="section-title">Notes from the field.</h1>
            <p className="page-hero__lede">
              Thoughts and write-ups on WordPress, Shopify, and Next.js
              development, based on real client work.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="tools-list">
        <div className="section-inner">
          {posts.length === 0 ? (
            <p className="work__empty">
              No posts yet — the first one is on the way. Check back soon.
            </p>
          ) : (
            <ScrollReveal className="blog-grid">
              {posts.map((post) => {
                const image = getFeaturedImage(post);
                const excerpt = stripHtml(post.excerpt?.rendered).slice(0, 140);
                return (
                  <Link href={`/blog/${post.slug}`} className="blog-card" key={post.id}>
                    <div className="blog-card__image">
                      {image ? (
                        <Image src={image} alt={post.title?.rendered || "Blog post"} width={800} height={450} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div className="blog-card__image-fallback">{"</>"}</div>
                      )}
                    </div>
                    <div className="blog-card__body">
                      <span className="blog-card__date">{formatDate(post.date)}</span>
                      <h2
                        className="blog-card__title"
                        dangerouslySetInnerHTML={{ __html: post.title?.rendered || "" }}
                      />
                      <p className="blog-card__excerpt">{excerpt}{excerpt.length === 140 ? "…" : ""}</p>
                      <span className="blog-card__cta">Read post →</span>
                    </div>
                  </Link>
                );
              })}
            </ScrollReveal>
          )}
        </div>
      </section>
    </main>
  );
}
