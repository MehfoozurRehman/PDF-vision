/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: "out",
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Handle PDF.js worker
    config.resolve.alias = {
      ...config.resolve.alias,
      "pdfjs-dist/build/pdf.worker.entry": "pdfjs-dist/build/pdf.worker.min.js",
    };

    // Handle canvas for PDF rendering
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // Handle node modules that need to be external
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push("canvas");
    }

    return config;
  },
  experimental: {
    esmExternals: "loose",
  },
  // Disable server-side features for Electron
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
