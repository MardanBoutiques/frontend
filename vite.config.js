import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  // Только для `npm run dev`: боевой API не разрешает CORS с localhost, поэтому
  // запросы идут через этот прокси (сервер-серверу, где CORS не действует).
  // Включается через VITE_API_URL=/__api/ в .env.local; на сборку не влияет.
  server: {
    proxy: {
      "/__api": {
        target: "https://api.mardanboutiques.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/__api/, ""),
      },
    },
  },
  optimizeDeps: {
    include: ['react-phone-input-2'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          axios: ["axios"],
          geodata: ["country-state-city"],
          select: ["react-select"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
