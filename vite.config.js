import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Frontend-Photobogota/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Configuración del aliasss
    },
  },
  server: {
    // Usar 'localhost' para desarrollo normal
    // Usar '0.0.0.0' para probar en el celular (conectado al mismo Wi-Fi que el PC)
    host: 'localhost',
    //host: '0.0.0.0', 
    port: 5173,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
  },
});
