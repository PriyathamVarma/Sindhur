import { NextRequest, NextResponse } from "next/server";
import { mongoDB } from "@/shared/lib/db/mongo";
import CertificationModel from "@/shared/models/mongodb/certifications/certification";
import { verifyToken } from "../../utils/verifyToken";
import { success, failure } from "../../utils/responses";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await mongoDB();
    const body = await req.json();
    const cert = await CertificationModel.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!cert) return NextResponse.json(failure("Certification not found"), { status: 404 });
    return NextResponse.json(success(cert, "Certification updated"));
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await mongoDB();
    const cert = await CertificationModel.findByIdAndDelete(params.id);
    if (!cert) return NextResponse.json(failure("Certification not found"), { status: 404 });
    return NextResponse.json(success(null, "Certification deleted"));
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}
