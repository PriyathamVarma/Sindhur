import { NextRequest, NextResponse } from "next/server";
import { mongoDB } from "@/shared/lib/db/mongo";
import ProductModel from "@/shared/models/mongodb/products/product";
import { verifyToken } from "../../utils/verifyToken";
import { success, failure } from "../../utils/responses";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await mongoDB();
    const adminMode = new URL(req.url).searchParams.get("admin") === "true";

    if (adminMode) {
      const auth = await verifyToken(req);
      if (auth instanceof NextResponse) return auth;
    }

    const filter: Record<string, unknown> = { slug: params.slug };
    if (!adminMode) filter.status = "published";

    const product = await ProductModel.findOne(filter).lean();
    if (!product) return NextResponse.json(failure("Product not found"), { status: 404 });

    return NextResponse.json(success(product));
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await mongoDB();
    const body    = await req.json();
    const product = await ProductModel.findOneAndUpdate(
      { slug: params.slug },
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!product) return NextResponse.json(failure("Product not found"), { status: 404 });
    return NextResponse.json(success(product, "Product updated"));
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await mongoDB();
    const product = await ProductModel.findOneAndDelete({ slug: params.slug });
    if (!product) return NextResponse.json(failure("Product not found"), { status: 404 });
    return NextResponse.json(success(null, "Product deleted"));
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}
