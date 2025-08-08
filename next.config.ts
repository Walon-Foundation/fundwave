import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lutmdjilgtykwwzsgnnj.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev", // Clerk profile avatars
      },
    ],
  },
};

export default nextConfig;
