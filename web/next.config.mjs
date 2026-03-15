import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.modules = [
      path.resolve(__dirname, "node_modules"),
      "node_modules",
    ];
    return config;
  },
  output: "export",
  experimental: {
    optimizePackageImports: [
      "react-bootstrap",
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/free-brands-svg-icons",
    ],
  },
  outputFileTracingRoot: path.join(__dirname, "../"),
  distDir: "build",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  sassOptions: {
    includePaths: ["./node_modules"],
    silenceDeprecations: [
      "legacy-js-api",
      "import",
      "color-functions",
      "global-builtin",
      "if-function",
      "function-units",
    ],
  },
};

export default nextConfig;
