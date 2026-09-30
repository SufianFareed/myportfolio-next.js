import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug, getFeaturedImage, stripHtml, formatDate } from "@/lib/wordpress";
import ScrollReveal from "@/components/ScrollReveal";

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post not found" };

  const description = stripHtml(post.excerpt?.rendered).slice(0, 160);
  return {
    title: stripHtml(post.title?.rendered),
    description,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: { title: stripHtml(post.title?.rendered), description },
  };
}

export const revalidate = 3600;

export default async function BlogPostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const image = getFeaturedImage(post);

  return (
    <main>
      <article className="page-hero blog-post">
        <div className="section-inner">
          <ScrollReveal>
            <Link href="/blog" className="tool-back">← All posts</Link>
            <p className="section-eyebrow">{formatDate(post.date)}</p>
            <h1
              className="section-title blog-post__title"
              dangerouslySetInnerHTML={{ __html: post.title?.rendered || "" }}
            />
          </ScrollReveal>
        </div>
      </article>

      {image && (
        <div className="section-inner blog-post__image">
          <Image src={image} alt={stripHtml(post.title?.rendered)} width={1200} height={630} style={{ width: "100%", height: "auto", borderRadius: "var(--radius-lg)" }} priority />
        </div>
      )}

      <section className="tools-list">
        <div className="section-inner">
          <ScrollReveal
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.content?.rendered || "" }}
          />
        </div>
      </section>
    </main>
  );
}
