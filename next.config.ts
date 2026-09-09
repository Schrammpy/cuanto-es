import type { NextConfig } from "next";

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/servicios/:path*',
        destination: '/costos/:path*',
        permanent: true, // Esto es una redirección 301 oficial para Google
      },
    ];
  },
};

export default nextConfig;