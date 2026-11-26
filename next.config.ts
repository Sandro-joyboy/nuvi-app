import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.1.4", "192.168.1.5", "localhost", "127.0.0.1"],
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
