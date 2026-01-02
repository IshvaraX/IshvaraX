/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",           // Required for static export
  images: {
    unoptimized: true,        // GitHub Pages cannot optimize images
  },
  // Dynamically detect repo base path for GitHub Pages
  basePath: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}`
    : "",
  assetPrefix: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}/`
    : "",
};

module.exports = nextConfig;
