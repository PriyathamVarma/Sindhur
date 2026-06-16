import { NextRequest, NextResponse } from "next/server";
import { mongoDB } from "@/shared/lib/db/mongo";
import ProductModel from "@/shared/models/mongodb/products/product";
import { verifyToken } from "../utils/verifyToken";
import { success, failure } from "../utils/responses";
import { slugify } from "@/shared/lib/utils";
import { cacheDel, CACHE_KEYS } from "@/utils/redis";

export async function GET(req: NextRequest) {
  try {
    await mongoDB();
    const { searchParams } = new URL(req.url);
    const adminMode = searchParams.get("admin") === "true";

    if (adminMode) {
      const auth = await verifyToken(req);
      if (auth instanceof NextResponse) return auth;
    }

    const page     = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit    = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const category = searchParams.get("category");
    const search   = searchParams.get("search");
    const skip     = (page - 1) * limit;

    const filter: Record<string, unknown> = adminMode ? {} : { status: "published" };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      ProductModel.find(filter)
        .select("-fullDescription -specifications")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ProductModel.countDocuments(filter),
    ]);

    return NextResponse.json(
      success({ items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } })
    );
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await mongoDB();
    const body = await req.json();
    const { name, category, shortDescription, fullDescription } = body;

    if (!name || !category || !shortDescription || !fullDescription) {
      return NextResponse.json(
        failure("name, category, shortDescription and fullDescription are required"),
        { status: 400 }
      );
    }

    let slug = body.slug ? slugify(body.slug) : slugify(name);
    const exists = await ProductModel.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;

    const product = await ProductModel.create({ ...body, slug });
    await cacheDel(CACHE_KEYS.PRODUCTS_LIST);
    return NextResponse.json(success(product, "Product created"), { status: 201 });
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}
