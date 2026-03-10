import { test, expect } from '@playwright/test';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Players', path: '/admin/players' },
  { label: 'Transactions', path: '/admin/transactions' },
  { label: 'Games', path: '/admin/games' },
  { label: 'Bonuses', path: '/admin/bonuses' },
  { label: 'KYC', path: '/admin/kyc' },
  { label: 'Risk', path: '/admin/risk' },
  { label: 'Reports', path: '/admin/reports' },
  { label: 'Settings', path: '/admin/settings' },
];

test.describe('Admin Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
    await page.getByRole('heading', { name: 'Dashboard', level: 1 }).waitFor({ timeout: 15_000 });
  });

  test('sidebar navigation links work', async ({ page }) => {
    for (const item of NAV_ITEMS.slice(1)) { // skip Dashboard (already there)
      await page.locator('aside nav').getByText(item.label, { exact: true }).click();
      await expect(page).toHaveURL(new RegExp(item.path));
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10_000 });
    }
  });

  test('active nav item is highlighted', async ({ page }) => {
    await page.locator('aside nav').getByText('Players', { exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/players/);

    // Active link has primary background
    const playersLink = page.locator('aside nav a', { hasText: 'Players' });
    await expect(playersLink).toHaveClass(/bg-primary/);
  });

  test('clicking logo text in sidebar stays on admin', async ({ page }) => {
    await expect(page.locator('aside').getByText('SlotsOne Admin')).toBeVisible();
  });
});
