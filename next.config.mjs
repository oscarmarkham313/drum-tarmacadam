/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export — every route prerenders to plain HTML in /out,
  // servable by GitHub Pages (and equally by Vercel).
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
