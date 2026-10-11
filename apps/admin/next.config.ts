import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import path from "path";

loadEnvConfig(path.join(__dirname));
loadEnvConfig(path.join(__dirname, "../.."));

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: apiUrl,
  },
  transpilePackages: ["@drmojtahedi/shared"],
};

export default nextConfig;
