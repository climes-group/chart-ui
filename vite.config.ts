import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    exclude: ["**/node_modules/**", "**/.claude/worktrees/**"],
    coverage: {
      exclude: [
        ".eslintrc.cjs",
        "*.config.*",
        "src/main.tsx",
        "src/App.tsx",
        "src/Chart.tsx",
        "**/dist/**",
        "**/Experimental/**",
        "**/__tests__/**",
      ],
    },
    env: {
      VITE_GEO_API_KEY: "mock_key",
      VITE_FF_USE_GEO_API: "true",
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
});
