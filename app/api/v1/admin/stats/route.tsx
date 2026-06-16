import { NextRequest, NextResponse } from "next/server";
import { mongoDB } from "@/shared/lib/db/mongo";
import QuoteRequestModel from "@/shared/models/mongodb/quotes/quoteRequest";
import BlogPostModel from "@/shared/models/mongodb/blog/blogPost";
import { verifyToken } from "../../utils/verifyToken";
import { success, failure } from "../../utils/responses";

export async function GET(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await mongoDB();

    const [
      totalQuotes,
      pendingQuotes,
      reviewingQuotes,
      totalPosts,
      publishedPosts,
      draftPosts,
      recentQuotes,
    ] = await Promise.all([
      QuoteRequestModel.countDocuments(),
      QuoteRequestModel.countDocuments({ status: "pending" }),
      QuoteRequestModel.countDocuments({ status: "reviewing" }),
      BlogPostModel.countDocuments(),
      BlogPostModel.countDocuments({ status: "published" }),
      BlogPostModel.countDocuments({ status: "draft" }),
      QuoteRequestModel.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json(
      success({
        quotes: { total: totalQuotes, pending: pendingQuotes, reviewing: reviewingQuotes },
        blog:   { total: totalPosts, published: publishedPosts, drafts: draftPosts },
        recentQuotes,
      }),
    );
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}
