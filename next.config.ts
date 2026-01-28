import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker 배포 시에만 standalone 사용 (Vercel은 자동 최적화)
  ...(process.env.DOCKER_BUILD === 'true' && { output: 'standalone' }),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'mgtqnuiawitzdhsrxwde.supabase.co',
      },
    ],
  },
};

export default nextConfig;
