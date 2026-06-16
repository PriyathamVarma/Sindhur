"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

type Props = {
  nextPath?: string;
  label?: string;
};

export default function GoogleSignInButton({
  nextPath = "/admin",
  label = "Continue with Gmail",
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (error) {
        toast.error(error.message || "Google sign-in failed");
        setLoading(false);
      }
    } catch {
      toast.error("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full py-3 border border-gray-200 bg-white hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400 text-gray-800 font-semibold rounded-xl text-[14px] transition-all flex items-center justify-center gap-2 shadow-sm"
    >
      {loading ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Opening Google...
        </>
      ) : (
        <>
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 bg-white text-[13px] font-black text-blue-500">
            G
          </span>
          {label}
        </>
      )}
    </button>
  );
}
