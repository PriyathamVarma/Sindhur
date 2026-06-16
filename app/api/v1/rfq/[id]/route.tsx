import { NextRequest, NextResponse } from "next/server";
import { mongoDB } from "@/shared/lib/db/mongo";
import RFQModel from "@/shared/models/mongodb/rfq/rfq";
import { verifyToken } from "../../utils/verifyToken";
import { success, failure } from "../../utils/responses";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await mongoDB();
    const body    = await req.json();
    const allowed = ["status", "adminNotes"];
    const update: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) update[key] = body[key];
    }

    const rfq = await RFQModel.findByIdAndUpdate(
      params.id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!rfq) return NextResponse.json(failure("RFQ not found"), { status: 404 });
    return NextResponse.json(success(rfq, "RFQ updated"));
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await mongoDB();
    const rfq = await RFQModel.findByIdAndDelete(params.id);
    if (!rfq) return NextResponse.json(failure("RFQ not found"), { status: 404 });
    return NextResponse.json(success(null, "RFQ deleted"));
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}
