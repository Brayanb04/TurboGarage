import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./", // 👈 ESTA LÍNEA ES CLAVE para que funcione en Netlify
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Turbo Garage",
        short_name: "TurboGarage",
        description: "Gestor de colección Hot Wheels 2025",
        theme_color: "#1e3a8a",
        background_color: "#0f172a",
        display: "standalone",
        orientation: "portrait",
        start_url: "./", // 👈 cambia de "/" a "./" también
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  build: {
    outDir: "dist", // 👈 asegúrate que la carpeta build es dist
  },
});
