import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getAppOrigin } from "@/utils/app-url";

function getSafeNext(req: NextRequest) {
  const next = req.nextUrl.searchParams.get("next") || "/admin";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const next = getSafeNext(req);
  const redirectTo = `${getAppOrigin(req.url)}/auth/callback?next=${encodeURIComponent(next)}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        prompt: "select_account",
      },
    },
  });

  if (error || !data.url) {
    const loginUrl = new URL("/login", getAppOrigin(req.url));
    loginUrl.searchParams.set("error", error?.message || "Google sign-in failed");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(data.url);
}
