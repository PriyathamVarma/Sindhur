import { NextRequest, NextResponse } from "next/server";
import { mongoDB } from "@/shared/lib/db/mongo";
import UserModel from "@/shared/models/mongodb/users/user";
import { verifyToken } from "../../utils/verifyToken";
import { success, failure } from "../../utils/responses";

type JwtPayload = {
  sub: string;
};

type AuthUser = {
  _id: { toString: () => string };
  name: string;
  email: string;
  role: "Admin";
  authProvider?: "credentials" | "google";
  supabaseUserId?: string;
  avatarUrl?: string;
};

function getErrorMessage(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong";
}

export async function GET(req: NextRequest) {
  const result = await verifyToken(req);
  if (result instanceof NextResponse) return result;

  const payload = result as JwtPayload;
  try {
    await mongoDB();
    const user = await UserModel
      .findById(payload.sub)
      .select("-passwordHash")
      .lean<AuthUser>();
    if (!user) return NextResponse.json(failure("User not found"), { status: 404 });
    return NextResponse.json(success({ ...user, id: user._id }));
  } catch (err: unknown) {
    return NextResponse.json(failure(getErrorMessage(err)), { status: 500 });
  }
}
