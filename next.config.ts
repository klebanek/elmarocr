import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? '/elmarocr' : '',
  images: {
    unoptimized: true,
  },
  turbopack: {},
  // Allow dynamic params in static export (routes handled client-side)
  trailingSlash: true,
};

export default nextConfig;
