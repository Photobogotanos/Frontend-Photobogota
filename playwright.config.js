// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Los tests E2E golpean un backend real compartido (photoapi.duckdns.org) y
  // un único servidor Vite. Correr muchos workers en paralelo satura esos
  // servicios y hace que los logins/páginas fallen por rate-limit o timing.
  // Por eso limitamos workers: en CI uno solo, local hasta 4.
  workers: process.env.CI ? 1 : 4,
  retries: process.env.CI ? 2 : 0,
  // Tiempo generoso por test: el backend y las páginas pesadas (mapa,
  // recharts lazy) pueden tardar, sobre todo si hay varios tests seguidos.
  timeout: 90 * 1000,
  expect: {
    timeout: 20 * 1000,
  },
  reporter: 'html',

  globalSetup: './global-setup.js',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});