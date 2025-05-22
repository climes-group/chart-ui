import viteBasicSslPlugin from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteBasicSslPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    // support `describe`, `test` etc. globally,
    // so you don't need to import them every time
    globals: true,
    // run tests in jsdom environment
    environment: "jsdom",
    // global test setup
    setupFiles: "./tests/setup.js",
    // exclude Experimental folder
    coverage: {
      exclude: [
        ".eslintrc.cjs",
        "*.config.js",
        "src/main.jsx",
        "src/App.jsx",
        "src/Chart.jsx",
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
});
