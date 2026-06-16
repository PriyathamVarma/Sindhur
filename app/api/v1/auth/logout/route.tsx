import { NextResponse } from "next/server";
import { success } from "../../utils/responses";

export async function POST() {
  const res = NextResponse.json(success(null, "Logged out successfully"));
  res.cookies.set({ name: "token", value: "", httpOnly: true, maxAge: 0, path: "/" });
  return res;
}
