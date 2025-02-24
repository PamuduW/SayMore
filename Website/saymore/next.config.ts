import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
};

export default nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: "export", // Enables static export
//   eslint: { ignoreDuringBuilds: true }, // Keeps existing ESLint setting
//   images: { unoptimized: true }, // Ensures images work in static export
//
//   // ✅ Fix for GitHub Pages (adjusts asset paths)
//   basePath: "/SayMore-Web", // Ensures correct routing on GitHub Pages
//   assetPrefix: "/SayMore-Web/", // Ensures styles and scripts load correctly
//   trailingSlash: true, // Ensures proper linking for static exports
// };
//
// module.exports = nextConfig; // ✅ Use CommonJS instead of ESM