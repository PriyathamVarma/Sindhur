import { NextRequest, NextResponse } from "next/server";
import { mongoDB } from "@/shared/lib/db/mongo";
import CertificationModel from "@/shared/models/mongodb/certifications/certification";
import { verifyToken } from "../utils/verifyToken";
import { success, failure } from "../utils/responses";
import { cacheDel, CACHE_KEYS } from "@/utils/redis";

export async function GET(req: NextRequest) {
  try {
    await mongoDB();
    const adminMode = new URL(req.url).searchParams.get("admin") === "true";

    if (adminMode) {
      const auth = await verifyToken(req);
      if (auth instanceof NextResponse) return auth;
    }

    const filter = adminMode ? {} : { status: "active" };
    const certs  = await CertificationModel.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(success(certs));
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
    if (!body.name || !body.issuingAuthority) {
      return NextResponse.json(
        failure("name and issuingAuthority are required"),
        { status: 400 }
      );
    }
    const cert = await CertificationModel.create(body);
    await cacheDel(CACHE_KEYS.CERTS_ACTIVE);
    return NextResponse.json(success(cert, "Certification created"), { status: 201 });
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}
