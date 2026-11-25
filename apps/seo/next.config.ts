import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@gul/shared'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  webpack(config) {
    config.resolve.extensionAlias = {
      ...(config.resolve.extensionAlias || {}),
      '.ts': ['.ts', '.tsx'],
    };
    return config;
  },
};

export default nextConfig;
