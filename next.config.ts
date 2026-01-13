import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Add your IP address to this array
    allowedDevOrigins: ['localhost:3000', '10.100.7.8:3000'], 
    
    webpack: (config) => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        return config;
    },
};

export default nextConfig;