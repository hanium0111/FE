/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    return config;
  },
  images: {
    domains: ["1am11m.store"],
  },
};

export default {
  ...nextConfig,
  assetPrefix: "",
};
