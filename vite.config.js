import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Куда `npm run dev` отправляет запросы к API. По умолчанию — боевой сервер,
// чтобы на локальной машине был сайт с настоящими товарами и фотографиями.
// Чтобы проверять свои правки до выкатки, ставим в .env.local адрес локальной
// админки: API_PROXY_TARGET=http://127.0.0.1:8001 — тогда сайт читает ту же
// базу, которую вы правите на http://localhost:8001/admin/.
const PROD_API = "https://api.mardanboutiques.com";

export default defineConfig(({ mode }) => {
  // Третий аргумент "" — читать и переменные без приставки VITE_: эта нужна
  // только сборщику и в код фронта попадать не должна.
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.API_PROXY_TARGET || PROD_API;

  return {
    plugins: [react()],
    base: "/",
    // Только для `npm run dev`: боевой API не разрешает CORS с localhost, поэтому
    // запросы идут через этот прокси (сервер-серверу, где CORS не действует).
    // Включается через VITE_API_URL=/__api/ в .env.local; на сборку не влияет.
    server: {
      proxy: {
        "/__api": {
          target: apiTarget,
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
  };
});
