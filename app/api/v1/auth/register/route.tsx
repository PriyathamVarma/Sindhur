import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { mongoDB } from "@/shared/lib/db/mongo";
import UserModel from "@/shared/models/mongodb/users/user";
import { success, failure } from "../../utils/responses";

export async function POST(req: NextRequest) {
  try {
    await mongoDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(failure("Name, email and password are required"), { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(failure("Password must be at least 8 characters"), { status: 400 });
    }

    const exists = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return NextResponse.json(failure("An account with this email already exists"), { status: 409 });
    }

    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT_ROUNDS || 12),
    );

    const user = await UserModel.create({ name: name.trim(), email: email.toLowerCase().trim(), passwordHash, role: "Admin" });

    return NextResponse.json(
      success({ id: user._id, name: user.name, email: user.email, role: user.role }, "Admin account created"),
      { status: 201 },
    );
  } catch (err: any) {
    console.error("auth/register:", err);
    return NextResponse.json(failure(err?.message), { status: 500 });
  }
}
