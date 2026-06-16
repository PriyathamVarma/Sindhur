import { NextRequest, NextResponse } from "next/server";
import { mongoDB } from "@/shared/lib/db/mongo";
import UserModel from "@/shared/models/mongodb/users/user";
import { verifyToken } from "../../utils/verifyToken";
import { success, failure } from "../../utils/responses";

export async function GET(req: NextRequest) {
  const result = await verifyToken(req);
  if (result instanceof NextResponse) return result;

  const payload = result as any;
  try {
    await mongoDB();
    const user = await UserModel.findById(payload.sub).select("-passwordHash").lean();
    if (!user) return NextResponse.json(failure("User not found"), { status: 404 });
    return NextResponse.json(success({ ...(user as any), id: (user as any)._id }));
  } catch (err: any) {
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}
