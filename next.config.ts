import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://www.upskilleveryday.com/tools/library-of-souls',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
