import { NextRequest, NextResponse } from "next/server";
import { mongoDB } from "@/shared/lib/db/mongo";
import BlogPostModel from "@/shared/models/mongodb/blog/blogPost";
import { verifyToken } from "../../utils/verifyToken";
import { success, failure } from "../../utils/responses";
import { slugify } from "@/shared/lib/utils";

type Ctx = { params: Promise<{ slug: string }> };

// Public: get single published post by slug
export async function GET(req: NextRequest, { params }: Ctx) {
  const { slug } = await params;

  try {
    await mongoDB();
    const { searchParams } = new URL(req.url);
    const adminMode = searchParams.get("admin") === "true";

    if (adminMode) {
      const auth = await verifyToken(req);
      if (auth instanceof NextResponse) return auth;
    }

    const filter: Record<string, unknown> = { slug };
    if (!adminMode) filter.status = "published";

    const post = await BlogPostModel.findOne(filter).lean();
    if (!post) return NextResponse.json(failure("Post not found"), { status: 404 });
    return NextResponse.json(success(post));
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}

// Admin: update post
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { slug } = await params;

  try {
    await mongoDB();
    const body = await req.json();
    const update: Record<string, unknown> = {};

    if (body.title)       { update.title = body.title.trim(); update.slug = body.slug?.trim() || slugify(body.title); }
    if (body.slug)        update.slug = body.slug.trim();
    if (body.excerpt)     update.excerpt = body.excerpt.trim();
    if (body.content)     update.content = body.content.trim();
    if (body.coverImage !== undefined) update.coverImage = body.coverImage?.trim();
    if (body.tags !== undefined) {
      update.tags = Array.isArray(body.tags)
        ? body.tags
        : body.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
    }
    if (body.status) {
      update.status = body.status;
      if (body.status === "published") update.publishedAt = new Date();
    }

    const updated = await BlogPostModel.findOneAndUpdate(
      { slug },
      { $set: update },
      { new: true, runValidators: true },
    ).lean();

    if (!updated) return NextResponse.json(failure("Post not found"), { status: 404 });
    return NextResponse.json(success(updated, "Post updated"));
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}

// Admin: delete post
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { slug } = await params;

  try {
    await mongoDB();
    const deleted = await BlogPostModel.findOneAndDelete({ slug }).lean();
    if (!deleted) return NextResponse.json(failure("Post not found"), { status: 404 });
    return NextResponse.json(success(null, "Post deleted"));
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}
