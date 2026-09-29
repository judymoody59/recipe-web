import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // `.next/standalone/` 에 실행에 필요한 파일만 모아 내보낸다.
  output: 'standalone',
};

export default nextConfig;
