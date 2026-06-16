import type { Metadata } from "next";
import type { IBlogPost } from "@/shared/interfaces/mongodb/blog/blogPost";
import { formatDate } from "@/shared/lib/utils";
import { mongoDB } from "@/shared/lib/db/mongo";
import BlogPostModel from "@/shared/models/mongodb/blog/blogPost";

export const metadata: Metadata = {
  title: "Blog & Export Insights — Sindhur Exports",
  description: "Expert articles on Indian export trade, commodity insights, spices, rice, coconuts, and global market trends from Sindhur Exports.",
  openGraph: {
    title: "Blog — Sindhur Exports",
    description: "Export insights, trade guides and commodity news from India's trusted export partner.",
    type: "website",
  },
};

async function getPosts(): Promise<IBlogPost[]> {
  try {
    await mongoDB();
    const items = await BlogPostModel.find({ status: "published" })
      .select("-content")
      .sort({ publishedAt: -1 })
      .limit(24)
      .lean();
    return items as unknown as IBlogPost[];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-950 pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-orange-400 text-[12px] font-bold tracking-[0.2em] uppercase">Export Insights</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
            Trade Knowledge &{" "}
            <span className="text-orange-400">Market Insights</span>
          </h1>
          <p className="mt-5 text-gray-400 text-[16px] max-w-xl mx-auto leading-relaxed">
            Expert articles on Indian commodity exports, trade compliance, market trends and sourcing guides.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No articles published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <a
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-xl hover:shadow-orange-50 transition-all duration-300 flex flex-col"
              >
                {post.coverImage ? (
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                    <span className="text-4xl">📰</span>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags?.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[11px] font-medium text-orange-600 bg-orange-50 border border-orange-100 rounded-full px-2.5 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-[17px] font-bold text-gray-900 group-hover:text-orange-600 transition-colors leading-snug mb-2 flex-1">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <span className="text-[12px] text-gray-400">
                      {formatDate(post.publishedAt || post.createdAt!)}
                    </span>
                    <span className="text-[13px] font-semibold text-orange-500 group-hover:text-orange-600 transition-colors">
                      Read more →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Back to site */}
      <div className="text-center pb-16">
        <a href="/" className="text-[14px] font-semibold text-gray-500 hover:text-orange-500 transition">
          ← Back to Sindhur Exports
        </a>
      </div>
    </div>
  );
}
