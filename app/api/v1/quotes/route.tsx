import { NextRequest, NextResponse } from "next/server";
import { mongoDB } from "@/shared/lib/db/mongo";
import QuoteRequestModel from "@/shared/models/mongodb/quotes/quoteRequest";
import { verifyToken } from "../utils/verifyToken";
import { success, failure } from "../utils/responses";

// Public: submit a quote request
export async function POST(req: NextRequest) {
  try {
    await mongoDB();
    const body = await req.json();
    const { name, email } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(failure("Name and email are required"), { status: 400 });
    }

    const quote = await QuoteRequestModel.create({
      name: name.trim(),
      company: body.company?.trim(),
      email: email.toLowerCase().trim(),
      country: body.country?.trim(),
      product: body.product,
      message: body.message?.trim(),
      status: "pending",
    });

    return NextResponse.json(success(quote, "Your inquiry has been received. We'll respond within 24 hours."), { status: 201 });
  } catch (err: any) {
    console.error("quotes POST:", err);
    return NextResponse.json(failure(err?.message || "Failed to submit inquiry"), { status: 500 });
  }
}

// Admin: list all quote requests
export async function GET(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await mongoDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page   = Number(searchParams.get("page") || "1");
    const limit  = Number(searchParams.get("limit") || "20");

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      QuoteRequestModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      QuoteRequestModel.countDocuments(filter),
    ]);

    return NextResponse.json(success({ items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }));
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}
