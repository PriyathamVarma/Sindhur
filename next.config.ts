import type { NextConfig } from "next";

function getSupabaseHostname() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "").hostname;
  } catch {
    return "oresprkgtglnhbiyqlzs.supabase.co";
  }
}

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: getSupabaseHostname(),
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
