import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// base se define por entorno:
//   - Vercel: usa "/" (por defecto, sin base path).
//   - GitHub Pages: se pasa VITE_BASE_PATH="/Frontend-Photobogota/".
// Definir VITE_BASE_PATH como variable de entorno en el build.
const base = process.env.VITE_BASE_PATH || "/";

export default defineConfig({
  plugins: [react()],
  base,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "localhost",
    port: 5173,
    hmr: {
      protocol: "ws",
      host: "localhost",
    },
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
