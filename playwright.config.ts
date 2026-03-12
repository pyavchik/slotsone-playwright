import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Write Allure environment info
const allureResultsDir = path.join(__dirname, 'allure-results');
if (!fs.existsSync(allureResultsDir)) {
  fs.mkdirSync(allureResultsDir, { recursive: true });
}
fs.writeFileSync(
  path.join(allureResultsDir, 'environment.properties'),
  [
    'Browser=Chromium',
    'Base.URL=https://pyavchik.space',
    `Environment=${process.env.CI ? 'CI' : 'Local'}`,
  ].join('\n'),
);

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
    // Public site tests (non-admin)
    {
      name: 'Public Site',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: '**/admin/**',
    },

    // Admin auth setup
    {
      name: 'Admin Setup',
      testMatch: '**/admin/admin.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // Admin login tests (no auth needed)
    {
      name: 'Admin Login',
      testMatch: '**/admin/login.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // Admin panel tests (authenticated via storageState)
    {
      name: 'Admin Panel',
      testDir: './tests/admin',
      testIgnore: ['admin.setup.ts', 'login.spec.ts'],
      dependencies: ['Admin Setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/admin.json',
      },
    },
  ],
});
