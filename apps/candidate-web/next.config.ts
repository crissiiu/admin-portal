import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@job-portal/ui", "@job-portal/api-contracts"]
};

export default nextConfig;

