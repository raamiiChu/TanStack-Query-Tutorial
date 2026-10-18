import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // StrictMode's double mount aborts and re-sends requests in dev, which makes
  // the request logs in the demos misleading.
  reactStrictMode: false,
  devIndicators: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
