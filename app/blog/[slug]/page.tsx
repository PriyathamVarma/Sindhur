import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { IBlogPost } from "@/shared/interfaces/mongodb/blog/blogPost";
import { formatDate } from "@/shared/lib/utils";
import { mongoDB } from "@/shared/lib/db/mongo";
import BlogPostModel from "@/shared/models/mongodb/blog/blogPost";

type Props = { params: Promise<{ slug: string }> };

async function getPost(slug: string): Promise<IBlogPost | null> {
  try {
    await mongoDB();
    const post = await BlogPostModel.findOne({ slug, status: "published" }).lean();
    return post as unknown as IBlogPost | null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "Post Not Found — Sindhur Exports" };

  return {
    title: `${post.title} — Sindhur Exports Blog`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt?.toString(),
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-950 pt-28 pb-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-transparent" />
        <div className="max-w-3xl mx-auto px-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags?.map((tag) => (
              <span key={tag} className="text-[11px] font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-5">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span>{formatDate(post.publishedAt || post.createdAt!)}</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>Sindhur Exports</span>
          </div>
        </div>
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <div className="max-w-3xl mx-auto px-6 -mt-6 mb-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl shadow-gray-200"
          />
        </div>
      )}

      {/* Article content */}
      <article className="max-w-3xl mx-auto px-6 pb-20">
        {/* Excerpt highlight */}
        <p className="text-lg text-gray-600 leading-relaxed font-medium border-l-4 border-orange-500 pl-5 mb-10 py-1">
          {post.excerpt}
        </p>

        {/* Main content */}
        <div
          className="prose prose-lg prose-gray max-w-none
            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-gray-900
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-4
            prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-bold
            prose-ul:my-4 prose-li:my-1 prose-li:text-gray-700
            prose-ol:my-4
            prose-blockquote:border-l-orange-500 prose-blockquote:text-gray-600 prose-blockquote:italic
            prose-img:rounded-xl prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">Published by</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center">
                <span className="text-white font-black text-sm">SE</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-[14px]">Sindhur Exports</p>
                <p className="text-gray-400 text-[12px]">Visakhapatnam, India</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href="/blog"
              className="px-5 py-2.5 border-2 border-orange-500 text-orange-500 font-semibold text-[13px] rounded-full hover:bg-orange-500 hover:text-white transition"
            >
              ← All Articles
            </a>
            <a
              href="/#contact"
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-[13px] rounded-full transition shadow-lg shadow-orange-200"
            >
              Get a Quote
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
