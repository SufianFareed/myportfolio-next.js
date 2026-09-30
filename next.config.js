/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "purple-mole-964641.hostingersite.com" },
    ],
  },
};

module.exports = nextConfig;
