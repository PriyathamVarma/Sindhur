import { NextRequest, NextResponse } from "next/server";
import { mongoDB } from "@/shared/lib/db/mongo";
import DownloadLeadModel from "@/shared/models/mongodb/downloads/downloadLead";
import { verifyToken } from "../../utils/verifyToken";
import { success, failure } from "../../utils/responses";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    await mongoDB();
    const lead = await DownloadLeadModel.findByIdAndDelete(id);
    if (!lead) return NextResponse.json(failure("Lead not found"), { status: 404 });
    return NextResponse.json(success(null, "Lead deleted"));
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}
