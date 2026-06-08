import type { NextConfig } from "next";
import { execSync } from "child_process";

let commitHash = "";
try {
  commitHash = execSync("git rev-parse --short HEAD").toString().trim();
} catch {
  commitHash = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "";
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_COMMIT_HASH: commitHash,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
