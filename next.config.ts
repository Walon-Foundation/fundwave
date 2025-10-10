import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Allow admin subdomain cross-origin requests in development
  ...(process.env.NODE_ENV === 'development' && {
    allowedDevOrigins: ['admin.localhost:3000'],
  }),
  images: {
    remotePatterns: [
      //development
      {
        protocol: 'https',
        hostname: 'iziaioorslstbzozmwte.storage.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/**',
      },
      {
        protocol: 'https',
        hostname: 'iziaioorslstbzozmwte.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/**',
      },

      
      //production
      {
        protocol: 'https',
        hostname: 'lutmdjilgtykwwzsgnnj.storage.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/**',
      },
      {
        protocol: 'https',
        hostname: 'lutmdjilgtykwwzsgnnj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/**',
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev", // Clerk profile avatars
      },
    ],
  },
};

export default nextConfig;
