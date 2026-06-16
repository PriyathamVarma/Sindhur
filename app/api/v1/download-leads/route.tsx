import { NextRequest, NextResponse } from "next/server";
import { mongoDB } from "@/shared/lib/db/mongo";
import DownloadLeadModel from "@/shared/models/mongodb/downloads/downloadLead";
import DownloadModel from "@/shared/models/mongodb/downloads/download";
import { verifyToken } from "../utils/verifyToken";
import { success, failure } from "../utils/responses";

export async function GET(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await mongoDB();
    const { searchParams } = new URL(req.url);
    const page  = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip  = (page - 1) * limit;

    const [items, total] = await Promise.all([
      DownloadLeadModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      DownloadLeadModel.countDocuments(),
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
    const { name, email, downloadId } = body;

    if (!name || !email || !downloadId) {
      return NextResponse.json(
        failure("name, email and downloadId are required"),
        { status: 400 }
      );
    }

    const download = await DownloadModel.findById(downloadId).lean() as any;
    if (!download) {
      return NextResponse.json(failure("Download item not found"), { status: 404 });
    }

    const lead = await DownloadLeadModel.create({
      name,
      email,
      company:       body.company,
      country:       body.country,
      phone:         body.phone,
      downloadId,
      downloadTitle: download.title,
    });

    return NextResponse.json(
      success({ lead, fileUrl: download.fileUrl }, "Lead captured successfully"),
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}
