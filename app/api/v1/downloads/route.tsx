import { NextRequest, NextResponse } from "next/server";
import { mongoDB } from "@/shared/lib/db/mongo";
import DownloadModel from "@/shared/models/mongodb/downloads/download";
import { verifyToken } from "../utils/verifyToken";
import { success, failure } from "../utils/responses";

export async function GET(req: NextRequest) {
  try {
    await mongoDB();
    const adminMode = new URL(req.url).searchParams.get("admin") === "true";

    if (adminMode) {
      const auth = await verifyToken(req);
      if (auth instanceof NextResponse) return auth;
    }

    const filter = adminMode ? {} : { status: "published" };
    const items  = await DownloadModel.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(success(items));
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
    if (!body.title || !body.description || !body.fileUrl || !body.type) {
      return NextResponse.json(
        failure("title, description, fileUrl and type are required"),
        { status: 400 }
      );
    }
    const item = await DownloadModel.create(body);
    return NextResponse.json(success(item, "Download item created"), { status: 201 });
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}
