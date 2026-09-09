import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 정적 배포용: `next build` 시 out/ 폴더에 정적 파일 생성
  output: "export",
};

export default nextConfig;
