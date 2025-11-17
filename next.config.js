/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // FIX: Allow fetching from Render backend (CORS-safe for server)
  experimental: {
    serverActions: {
      allowedOrigins: ["https://edmbackend.onrender.com"],
    },
  },

  // FIX: Allow external images (your blogs store Base64 mostly, but still safe)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "edmbackend.onrender.com",
      },
    ],
  },
};

module.exports = nextConfig;
