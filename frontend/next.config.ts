import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // 1. 브라우저가 호출하는 주소
        source: '/api/:path*',
        // 2. 실제로 데이터를 가져올 주소 (로컬 스프링 부트)
        destination: 'http://localhost:8036/:path*',
      },
      {
        // 1. 브라우저가 호출하는 주소
        source: '/images/:path*',
        // 2. 실제로 데이터를 가져올 주소 (로컬 스프링 부트)
        destination: 'http://localhost:8036/:path*',
      },
    ];
  },
  images: {
    unoptimized: true, // 로컬 개발용
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
