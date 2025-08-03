import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteMockServe } from "vite-plugin-mock";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteMockServe({
      mockPath: "mock",
      localEnabled: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //   host: '0.0.0.0', // 监听所有网络接口
  //   port: 5173,       // 确保端口可用
  //   strictPort: true  // 如果端口被占用则退出
  // }
});
