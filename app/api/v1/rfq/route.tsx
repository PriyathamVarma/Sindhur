import { NextRequest, NextResponse } from "next/server";
import { mongoDB } from "@/shared/lib/db/mongo";
import RFQModel from "@/shared/models/mongodb/rfq/rfq";
import { verifyToken } from "../utils/verifyToken";
import { success, failure } from "../utils/responses";

export async function GET(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await mongoDB();
    const { searchParams } = new URL(req.url);
    const page    = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit   = Math.min(500, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const status  = searchParams.get("status");
    const country = searchParams.get("country");
    const product = searchParams.get("product");
    const search  = searchParams.get("search");
    const skip    = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (status)  filter.status  = status;
    if (country) filter.country = country;
    if (product) filter.productInterested = { $regex: product, $options: "i" };
    if (search) {
      filter.$or = [
        { buyerName:   { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
        { email:       { $regex: search, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      RFQModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      RFQModel.countDocuments(filter),
    ]);

    return NextResponse.json(
      success({ items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } })
    );
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await mongoDB();
    const body = await req.json();
    const { buyerName, companyName, email, country, businessType, productInterested } = body;

    if (!buyerName || !companyName || !email || !country || !businessType || !productInterested) {
      return NextResponse.json(
        failure("buyerName, companyName, email, country, businessType and productInterested are required"),
        { status: 400 }
      );
    }

    const rfq = await RFQModel.create({ ...body, status: "new" });
    return NextResponse.json(success(rfq, "RFQ submitted successfully"), { status: 201 });
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}
