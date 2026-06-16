import { NextRequest, NextResponse } from "next/server";
import { mongoDB } from "@/shared/lib/db/mongo";
import DownloadModel from "@/shared/models/mongodb/downloads/download";
import { verifyToken } from "../../utils/verifyToken";
import { success, failure } from "../../utils/responses";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    await mongoDB();
    const body = await req.json();
    const item = await DownloadModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!item) return NextResponse.json(failure("Download item not found"), { status: 404 });
    return NextResponse.json(success(item, "Download item updated"));
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    await mongoDB();
    const item = await DownloadModel.findByIdAndDelete(id);
    if (!item) return NextResponse.json(failure("Download item not found"), { status: 404 });
    return NextResponse.json(success(null, "Download item deleted"));
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}
