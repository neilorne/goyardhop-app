import type { NextConfig } from "next";

// Ship the county lot-size table with the server code that reads it.
const nextConfig: NextConfig = {
  outputFileTracingIncludes: { "/**": ["./data/parcels.json"] },
};

export default nextConfig;
