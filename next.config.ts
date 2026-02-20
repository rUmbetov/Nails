import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true, // Включает правильную трансформацию и добавляет SSR-классы
  },
};

export default nextConfig;
