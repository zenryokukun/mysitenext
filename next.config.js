/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // This line is needed for docker.
  output: "standalone",
}

module.exports = nextConfig
