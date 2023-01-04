/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "s.gravatar.com",
      "lh3.googleusercontent.com",
      "via.placeholder.com"
    ]
  }
}

module.exports = nextConfig
