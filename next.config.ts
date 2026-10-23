import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No cacheComponents: with it, Next keeps the last three visited pages mounted
  // but hidden (React Activity), 3D canvases included. Pages here are static anyway.
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
