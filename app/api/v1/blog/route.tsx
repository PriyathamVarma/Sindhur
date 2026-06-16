import { NextRequest, NextResponse } from "next/server";
import { mongoDB } from "@/shared/lib/db/mongo";
import BlogPostModel from "@/shared/models/mongodb/blog/blogPost";
import { verifyToken } from "../utils/verifyToken";
import { success, failure } from "../utils/responses";
import { slugify } from "@/shared/lib/utils";
import { cacheDel, CACHE_KEYS } from "@/utils/redis";

export async function GET(req: NextRequest) {
  try {
    await mongoDB();
    const { searchParams } = new URL(req.url);
    const adminMode = searchParams.get("admin") === "true";
    const tag   = searchParams.get("tag");
    const page  = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "12");

    if (adminMode) {
      const auth = await verifyToken(req);
      if (auth instanceof NextResponse) return auth;
    }

    const filter: Record<string, unknown> = adminMode ? {} : { status: "published" };
    if (tag) filter.tags = tag;

    const [items, total] = await Promise.all([
      BlogPostModel.find(filter)
        .select("-content")
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      BlogPostModel.countDocuments(filter),
    ]);

    return NextResponse.json(success({ items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }));
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const payload = auth as any;

  try {
    await mongoDB();
    const body = await req.json();
    const { title, excerpt, content } = body;

    if (!title?.trim() || !excerpt?.trim() || !content?.trim()) {
      return NextResponse.json(failure("Title, excerpt and content are required"), { status: 400 });
    }

    let slug = body.slug?.trim() || slugify(title);
    const existing = await BlogPostModel.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const post = await BlogPostModel.create({
      title:       title.trim(),
      slug,
      excerpt:     excerpt.trim(),
      content:     content.trim(),
      coverImage:  body.coverImage?.trim(),
      tags:        Array.isArray(body.tags) ? body.tags : (body.tags?.split(",").map((t: string) => t.trim()).filter(Boolean) || []),
      status:      body.status || "draft",
      authorId:    payload.sub,
      publishedAt: body.status === "published" ? new Date() : undefined,
    });

    await cacheDel(CACHE_KEYS.BLOG_LIST);
    return NextResponse.json(success(post, "Post created"), { status: 201 });
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}
