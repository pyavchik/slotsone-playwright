import { test as setup } from '@playwright/test';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/admin/login');
  await page.getByLabel('Email').fill(ADMIN_EMAIL);
  await page.getByLabel('Password').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();

  // Wait for redirect to admin dashboard
  await page.waitForURL('**/admin', { timeout: 15_000 });

  // Save signed-in state
  await page.context().storageState({ path: '.auth/admin.json' });
});
