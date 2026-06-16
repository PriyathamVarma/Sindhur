import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { mongoDB } from "@/shared/lib/db/mongo";
import QuoteRequestModel from "@/shared/models/mongodb/quotes/quoteRequest";
import { verifyToken } from "../../utils/verifyToken";
import { success, failure } from "../../utils/responses";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json(failure("Invalid ID"), { status: 400 });
  }

  try {
    await mongoDB();
    const body = await req.json();
    const allowedFields = ["status", "adminNotes"];
    const update: Record<string, unknown> = {};
    for (const k of allowedFields) {
      if (body[k] !== undefined) update[k] = body[k];
    }

    const updated = await QuoteRequestModel.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true },
    ).lean();

    if (!updated) return NextResponse.json(failure("Quote request not found"), { status: 404 });
    return NextResponse.json(success(updated, "Updated"));
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json(failure("Invalid ID"), { status: 400 });
  }

  try {
    await mongoDB();
    const deleted = await QuoteRequestModel.findByIdAndDelete(id).lean();
    if (!deleted) return NextResponse.json(failure("Not found"), { status: 404 });
    return NextResponse.json(success(null, "Deleted"));
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}
