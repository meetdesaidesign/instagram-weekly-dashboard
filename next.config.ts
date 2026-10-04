import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/captions", destination: "/", permanent: false },
      { source: "/ideas", destination: "/", permanent: false },
      { source: "/analytics", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
