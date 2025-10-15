import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to backend during development
      "/api": {
        target: "https://vzx0m7qz-5000.inc1.devtunnels.ms/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
