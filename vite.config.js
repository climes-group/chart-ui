import viteBasicSslPlugin from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteBasicSslPlugin()],
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
        "vite.config.js",
        "**/dist/**",
        "**/Experimental/**",
      ],
    },
  },
});
