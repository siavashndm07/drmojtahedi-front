import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";
const mediaBaseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.trim() ?? "";

const nextConfig: NextConfig = {
  transpilePackages: ["@drmojtahedi/shared"],
  env: {
    NEXT_PUBLIC_API_URL: apiUrl,
    NEXT_PUBLIC_MEDIA_BASE_URL: mediaBaseUrl,
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
