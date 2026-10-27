/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Only 100 is allowed, so every next/image — including ones added later —
    // is served at full quality instead of the default 75.
    qualities: [100],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840, 4096],
  },
};

export default nextConfig;
