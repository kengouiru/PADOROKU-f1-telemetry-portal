/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.BUILD_DIR || '.next',
  reactStrictMode: true,
  // Allow cross-origin requests to OpenF1 API images/resources if needed
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.openf1.org',
      },
    ],
  },
};

export default nextConfig;
