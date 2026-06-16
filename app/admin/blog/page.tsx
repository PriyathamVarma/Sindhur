"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/shared/lib/utils";
import type { IBlogPost } from "@/shared/interfaces/mongodb/blog/blogPost";
import { PenLine, Trash2, Plus, Globe, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminBlogPage() {
  const [posts, setPosts]     = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<"all" | "published" | "draft">("all");

  const fetchPosts = () => {
    setLoading(true);
    fetch("/api/v1/blog?admin=true&limit=50", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (d.success) setPosts(d.data.items); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const deletePost = async (slug: string) => {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/v1/blog/${slug}`, { method: "DELETE", credentials: "include" });
    const data = await res.json();
    if (data.success) {
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
      toast.success("Post deleted");
    } else {
      toast.error(data.message);
    }
  };

  const toggleStatus = async (post: IBlogPost) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    const res = await fetch(`/api/v1/blog/${post.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await res.json();
    if (data.success) {
      setPosts((prev) => prev.map((p) => p.slug === post.slug ? { ...p, status: newStatus } : p));
      toast.success(`Post ${newStatus === "published" ? "published" : "unpublished"}`);
    } else {
      toast.error(data.message);
    }
  };

  const filtered = filter === "all" ? posts : posts.filter((p) => p.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Blog Posts</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} total posts</p>
        </div>
        <a
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-semibold rounded-xl transition shadow-lg shadow-orange-200"
        >
          <Plus className="w-4 h-4" />
          New Post
        </a>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(["all", "published", "draft"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all capitalize ${
              filter === v
                ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-20" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
          <FileText className="w-8 h-8 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">No posts yet</p>
          <a href="/admin/blog/new" className="text-[13px] font-semibold text-orange-500 hover:text-orange-600">
            Write your first article →
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => (
            <div key={post._id} className="bg-white rounded-2xl border border-gray-100 hover:border-orange-100 transition-colors">
              <div className="flex items-center gap-4 px-5 py-4">
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-orange-400" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-[14px] truncate">{post.title}</p>
                  <div className="flex flex-wrap gap-2 mt-1 items-center">
                    <span className="text-[12px] text-gray-400">{formatDate(post.createdAt!)}</span>
                    {post.tags?.slice(0, 2).map((t) => (
                      <span key={t} className="text-[11px] text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    post.status === "published"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}>
                    {post.status}
                  </span>

                  {post.status === "published" && (
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition"
                      title="View live"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}

                  <a
                    href={`/admin/blog/${post._id}/edit`}
                    className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition"
                    title="Edit"
                  >
                    <PenLine className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => toggleStatus(post)}
                    className="px-3 py-1.5 text-[12px] font-semibold rounded-xl border transition hover:border-orange-300 text-gray-600 border-gray-200 hover:text-orange-600"
                    title={post.status === "published" ? "Unpublish" : "Publish"}
                  >
                    {post.status === "published" ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    onClick={() => deletePost(post.slug)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
