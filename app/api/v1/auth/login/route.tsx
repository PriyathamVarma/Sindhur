import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { mongoDB } from "@/shared/lib/db/mongo";
import UserModel from "@/shared/models/mongodb/users/user";
import { success, failure } from "../../utils/responses";

type CredentialUser = {
  _id: { toString: () => string };
  name?: string;
  email: string;
  passwordHash?: string;
  role: "Admin";
};

function getErrorMessage(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong";
}

export async function POST(req: NextRequest) {
  try {
    await mongoDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(failure("Email and password are required"), { status: 400 });
    }

    const user = await UserModel
      .findOne({ email: email.toLowerCase().trim() })
      .lean<CredentialUser>();
    if (!user) {
      return NextResponse.json(failure("Invalid email or password"), { status: 401 });
    }

    if (!user.passwordHash) {
      return NextResponse.json(failure("Use Google sign-in for this account"), { status: 401 });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return NextResponse.json(failure("Invalid email or password"), { status: 401 });
    }

    const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];
    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn },
    );

    const res = NextResponse.json(
      success(
        { id: user._id, name: user.name, email: user.email, role: user.role },
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
  } catch (err: unknown) {
    console.error("auth/login:", err);
    return NextResponse.json(failure(getErrorMessage(err)), { status: 500 });
  }
}
