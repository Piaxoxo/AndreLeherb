import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The label's own domains land on the imprint of this site.
  async redirects() {
    return [
      "newartmusicproductions.at",
      "www.newartmusicproductions.at",
      "newartmusicproductions.com",
      "www.newartmusicproductions.com",
    ].map((host) => ({
      source: "/:path*",
      has: [{ type: "host", value: host }],
      destination: "https://andre-leherb.vercel.app/impressum",
      permanent: false,
    }));
  },
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
