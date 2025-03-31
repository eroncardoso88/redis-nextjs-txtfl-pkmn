/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.infrastructureLogging = {
      level: 'verbose',
    };
    return config;
  },
};

export default nextConfig;
