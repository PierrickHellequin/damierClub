import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // Force le rechargement en désactivant le cache SWC et en ajoutant un buildId unique
  generateBuildId: async () => {
    return `build-${Date.now()}-${Math.random().toString(36).substring(7)}`
  },
  // Désactive le cache de build en développement
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Headers pour forcer le navigateur à ne pas cacher
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
