import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function verifyToken(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}
