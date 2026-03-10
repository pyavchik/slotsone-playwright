import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright'],
  ],
  use: {
    baseURL: 'https://pyavchik.space',
    actionTimeout: 10_000,
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  expect: {
    timeout: 10_000,
  },
  projects: [
    // Existing non-admin tests
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: '**/admin/**',
    },

    // Admin auth setup
    {
      name: 'admin-setup',
      testMatch: '**/admin/admin.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // Admin login tests (no auth needed)
    {
      name: 'admin-login',
      testMatch: '**/admin/login.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // Admin tests (authenticated via storageState)
    {
      name: 'admin',
      testDir: './tests/admin',
      testIgnore: ['admin.setup.ts', 'login.spec.ts'],
      dependencies: ['admin-setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/admin.json',
      },
    },
  ],
});
