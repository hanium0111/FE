/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    return config;
  },
  images: {
    domains: ["1am11m.store", "lh3.googleusercontent.com"],
  },
};

export default {
  ...nextConfig,
  assetPrefix: "",
};
