"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/shared/lib/utils";
import toast from "react-hot-toast";
import { ArrowLeft, Eye, Save } from "lucide-react";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title:      "",
    slug:       "",
    excerpt:    "",
    content:    "",
    coverImage: "",
    tags:       "",
    status:     "draft" as "draft" | "published",
  });
  const [loading, setLoading]   = useState(false);
  const [preview, setPreview]   = useState(false);

  const handleTitleChange = (title: string) => {
    setForm((p) => ({ ...p, title, slug: slugify(title) }));
  };

  const handleSubmit = async (publishNow = false) => {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      toast.error("Title, excerpt and content are required");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/v1/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          status: publishNow ? "published" : form.status,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to create post");
        return;
      }

      toast.success(publishNow ? "Post published!" : "Draft saved");
      router.push("/admin/blog");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 " +
    "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition";
  const labelCls = "block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2";

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">New Article</h1>
          <p className="text-gray-500 text-sm mt-0.5">Write and publish a blog post</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-6">
        {/* Title */}
        <div>
          <label className={labelCls}>Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="E.g. How India Became the World's Largest Spice Exporter"
            className={inputCls + " text-base font-semibold"}
          />
        </div>

        {/* Slug */}
        <div>
          <label className={labelCls}>URL Slug</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">/blog/</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="auto-generated"
              className={inputCls}
            />
          </div>
        </div>

        {/* Cover image */}
        <div>
          <label className={labelCls}>Cover Image URL</label>
          <input
            type="url"
            value={form.coverImage}
            onChange={(e) => setForm((p) => ({ ...p, coverImage: e.target.value }))}
            placeholder="https://images.unsplash.com/..."
            className={inputCls}
          />
          {form.coverImage && (
            <img src={form.coverImage} alt="Cover preview" className="mt-3 h-40 w-full object-cover rounded-xl" />
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label className={labelCls}>Excerpt / Meta Description *</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
            placeholder="A short summary that appears in blog listings and search engines (150–160 chars ideal)"
            rows={3}
            className={inputCls + " resize-none"}
          />
          <p className="text-[11px] text-gray-400 mt-1">{form.excerpt.length} / 160 characters</p>
        </div>

        {/* Tags */}
        <div>
          <label className={labelCls}>Tags (comma-separated)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
            placeholder="export, spices, india, trade"
            className={inputCls}
          />
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelCls + " mb-0"}>Content * (HTML supported)</label>
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500 hover:text-orange-500 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              {preview ? "Edit" : "Preview"}
            </button>
          </div>

          {preview ? (
            <div
              className="min-h-[300px] p-4 rounded-xl border border-gray-200 bg-gray-50 prose prose-sm max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: form.content }}
            />
          ) : (
            <textarea
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              placeholder={`<h2>Introduction</h2>\n<p>Your article content here. You can use HTML tags for formatting.</p>\n\n<h2>Section Heading</h2>\n<p>More content...</p>`}
              rows={16}
              className={inputCls + " resize-y font-mono text-[13px]"}
            />
          )}
        </div>

        {/* Status */}
        <div>
          <label className={labelCls}>Default Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as any }))}
            className={inputCls}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-60 z-20 border-t border-gray-100 bg-white/95 backdrop-blur-sm px-6 py-4 flex items-center justify-end gap-3">
        <button
          onClick={() => handleSubmit(false)}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold text-[13px] rounded-xl transition disabled:opacity-60"
        >
          <Save className="w-3.5 h-3.5" />
          {loading ? "Saving..." : "Save Draft"}
        </button>
        <button
          onClick={() => handleSubmit(true)}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-[13px] rounded-xl transition shadow-lg shadow-orange-200 disabled:opacity-60"
        >
          {loading ? "Publishing..." : "Publish Now"}
        </button>
      </div>

      {/* Space for sticky bar */}
      <div className="h-20" />
    </div>
  );
}
