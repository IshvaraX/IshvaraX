// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
// }

// export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'export', // Required for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  basePath: '/IshvaraX', // Your repository name
  assetPrefix: '/IshvaraX/', // Your repository name
  trailingSlash: true,
}

export default nextConfig