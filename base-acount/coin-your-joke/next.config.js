/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@zoralabs/coins-sdk'],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    return config;
  },
  experimental: {
    esmExternals: 'loose'
  }
};

module.exports = nextConfig;
