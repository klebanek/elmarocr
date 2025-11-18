import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
};

// PWA configuration (temporarily disabled for build)
// Uncomment to enable PWA:
// import withPWA from "next-pwa";
// export default withPWA({
//   dest: "public",
//   disable: process.env.NODE_ENV === "development",
//   register: true,
//   skipWaiting: true,
// })(nextConfig);

export default nextConfig;
