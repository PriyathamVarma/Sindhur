import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { createClient } from "@/utils/supabase/server";
import { getAppOrigin } from "@/utils/app-url";
import { mongoDB } from "@/shared/lib/db/mongo";
import UserModel from "@/shared/models/mongodb/users/user";

function getRedirectOrigin(request: Request, origin: string) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (process.env.NODE_ENV !== "development" && forwardedHost) {
    return getAppOrigin(`https://${forwardedHost}`);
  }
  return getAppOrigin(origin);
}

function getSafeNext(url: URL) {
  const next = url.searchParams.get("next") || "/admin";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
}

function redirectToLogin(origin: string, message: string) {
  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set("error", message);
  return NextResponse.redirect(loginUrl);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const redirectOrigin = getRedirectOrigin(request, url.origin);
  const next = getSafeNext(url);

  if (!code) return redirectToLogin(redirectOrigin, "Google sign-in was cancelled");

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) return redirectToLogin(redirectOrigin, "Google sign-in failed");

  const supabaseUser = data.user;
  const email = supabaseUser?.email?.toLowerCase().trim();

  if (!email) return redirectToLogin(redirectOrigin, "Google account email was not shared");

  await mongoDB();

  const metadata = supabaseUser.user_metadata || {};
  const name =
    typeof metadata.full_name === "string" ? metadata.full_name :
    typeof metadata.name === "string" ? metadata.name :
    email.split("@")[0];
  const avatarUrl = typeof metadata.avatar_url === "string" ? metadata.avatar_url : undefined;

  let user = await UserModel.findOne({ email });

  if (!user) {
    const passwordHash = await bcrypt.hash(
      crypto.randomUUID(),
      Number(process.env.BCRYPT_SALT_ROUNDS || 12),
    );

    user = await UserModel.create({
      name,
      email,
      passwordHash,
      authProvider: "google",
      supabaseUserId: supabaseUser.id,
      avatarUrl,
      role: "Admin",
    });
  } else {
    user.name = user.name || name;
    user.authProvider = "google";
    user.supabaseUserId = supabaseUser.id;
    if (avatarUrl) user.avatarUrl = avatarUrl;
    await user.save();
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];
  const token = jwt.sign(
    { sub: user._id.toString(), email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn },
  );

  const response = NextResponse.redirect(new URL(next, redirectOrigin));
  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Number(process.env.JWT_COOKIE_MAX_AGE || 604800),
  });

  return response;
}
