import type { Metadata } from "next";
import { excerpt, fetchPublic, pageMetadata, siteConfig } from "@/lib/site";

type Post = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
};

type Props = { params: Promise<{ id: string }>; children: React.ReactNode };

const getPost = (id: string) => fetchPublic<Post>(`/blogs/${encodeURIComponent(id)}`);

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) {
    return pageMetadata({
      title: "Post not found",
      description: "This blog post could not be found.",
      path: `/blog/${id}`,
      noIndex: true,
    });
  }
  const published = new Date(post.createdAt).toISOString();
  return pageMetadata({
    title: post.title,
    description: excerpt(post.content),
    path: `/blog/${post.id}`,
    type: "article",
    publishedTime: published,
    modifiedTime: published,
    tags: post.tags,
    keywords: post.tags,
  });
}

export default async function BlogPostLayout({ params, children }: Props) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return children;

  const url = `${siteConfig.url}/blog/${post.id}`;
  const published = new Date(post.createdAt).toISOString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: excerpt(post.content),
        url,
        mainEntityOfPage: url,
        datePublished: published,
        dateModified: published,
        keywords: post.tags.join(", "),
        image: `${siteConfig.url}${siteConfig.ogImage}`,
        inLanguage: "en",
        author: { "@id": `${siteConfig.url}/#organization` },
        publisher: { "@id": `${siteConfig.url}/#organization` },
        isPartOf: { "@id": `${siteConfig.url}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
