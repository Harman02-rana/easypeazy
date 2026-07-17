import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root explicitly. Without this, Next.js walks up the
  // filesystem looking for a lockfile to infer the root, and can pick the
  // wrong directory if any unrelated lockfile exists above this project
  // (this matters specifically for deployments that set a subdirectory,
  // like Vercel's "Root Directory: web", where file tracing must stay
  // scoped to this folder for the build output to be correct).
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
