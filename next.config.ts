import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Upload max body size
  serverActions: {
    bodySizeLimit: '10mb',
  },
};

export default nextConfig;
