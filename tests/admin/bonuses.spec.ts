import { test, expect } from '@playwright/test';
import { AdminBonusesPage } from '../../pages/admin/bonuses.page';

test.describe('Admin Bonuses', () => {
  let bonuses: AdminBonusesPage;

  test.beforeEach(async ({ page }) => {
    bonuses = new AdminBonusesPage(page);
    await bonuses.goto();
    await expect(bonuses.title).toBeVisible({ timeout: 15_000 });
  });

  test('page renders with title', async () => {
    await expect(bonuses.title).toContainText('Bonuses');
  });

  test('player bonuses tab shows data', async () => {
    await expect(bonuses.bonusesTab).toBeVisible();
    await expect(bonuses.table).toBeVisible({ timeout: 15_000 });
    const rowCount = await bonuses.tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('promotions tab is available and shows data', async () => {
    await bonuses.promotionsTab.click();
    await expect(bonuses.table).toBeVisible({ timeout: 10_000 });
  });

  test('both tabs are visible', async () => {
    await expect(bonuses.bonusesTab).toBeVisible();
    await expect(bonuses.promotionsTab).toBeVisible();
  });
});
