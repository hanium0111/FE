import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import fsExtra from "fs-extra";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/temp/:path*",
        destination: "/public/temp/:path*",
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      const zipFilePath = path.join(
        process.cwd(),
        "data/testCode",
        "template.zip"
      );
      const tempDir = path.join(process.cwd(), "public/temp");

      if (fs.existsSync(tempDir)) {
        fsExtra.removeSync(tempDir);
      }

      fsExtra.ensureDirSync(tempDir);

      const zip = new AdmZip(zipFilePath);
      zip.extractAllTo(tempDir, true);
    }

    return config;
  },
};

export default {
  ...nextConfig,
  assetPrefix: "",
};
