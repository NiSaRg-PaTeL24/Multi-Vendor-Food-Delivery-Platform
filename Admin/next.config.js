/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Environment variables exposed to the client
    env: {
      AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    },
  };
  
  module.exports = nextConfig;