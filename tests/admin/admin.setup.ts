import { test as setup } from '@playwright/test';

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/admin/login');
  await page.getByLabel('Email').fill('admin@slotsone.com');
  await page.getByLabel('Password').fill('admin123');
  await page.getByRole('button', { name: /sign in/i }).click();

  // Wait for redirect to admin dashboard
  await page.waitForURL('**/admin', { timeout: 15_000 });

  // Save signed-in state
  await page.context().storageState({ path: '.auth/admin.json' });
});
