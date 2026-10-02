import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src/__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html']] : [['html', { open: 'never' }]],

  // Each test walks five routes, and a dev server compiles each on first
  // request, so the default 30s is not enough for the golden path.
  timeout: 120_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3003',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Only manage a server when one is not already provided. PLAYWRIGHT_BASE_URL
  // points at a running instance (a CI service container, or a dev server on
  // another port); without this the config still spawned `pnpm dev`, which failed
  // with "Invalid project directory: --port" because `pnpm dev` passes its flags
  // through differently.
  webServer: process.env.CI || process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'pnpm dev -- --port 3003',
        url: 'http://localhost:3003',
        reuseExistingServer: true,
        timeout: 120_000,
      },
})
