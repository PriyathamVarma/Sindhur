import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { mongoDB } from "@/shared/lib/db/mongo";
import UserModel from "@/shared/models/mongodb/users/user";
import { success, failure } from "../../utils/responses";

export async function POST(req: NextRequest) {
  try {
    await mongoDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(failure("Email and password are required"), { status: 400 });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() }).lean();
    if (!user) {
      return NextResponse.json(failure("Invalid email or password"), { status: 401 });
    }

    const match = await bcrypt.compare(password, (user as any).passwordHash);
    if (!match) {
      return NextResponse.json(failure("Invalid email or password"), { status: 401 });
    }

    const token = jwt.sign(
      { sub: (user as any)._id.toString(), email: (user as any).email, role: (user as any).role },
      process.env.JWT_SECRET!,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any },
    );

    const res = NextResponse.json(
      success(
        { id: (user as any)._id, name: (user as any).name, email: (user as any).email, role: (user as any).role },
        "Welcome back!",
      ),
    );

    res.cookies.set({
      name:     "token",
      value:    token,
      httpOnly: true,
      sameSite: "lax",
      secure:   process.env.NODE_ENV === "production",
      path:     "/",
      maxAge:   Number(process.env.JWT_COOKIE_MAX_AGE || 604800),
    });

    return res;
  } catch (err: any) {
    console.error("auth/login:", err);
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}
