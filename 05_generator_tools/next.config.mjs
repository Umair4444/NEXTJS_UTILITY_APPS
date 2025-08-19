/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "source.unsplash.com" },
      { hostname: "imgflip.com" },
      { hostname: "i.imgflip.com" },
      { hostname: "i.redd.it" },
    ],
  },
};

export default nextConfig;
