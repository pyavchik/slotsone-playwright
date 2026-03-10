import { test, expect } from '@playwright/test';
import { AdminRiskPage } from '../../pages/admin/risk.page';

test.describe('Admin Risk', () => {
  let risk: AdminRiskPage;

  test.beforeEach(async ({ page }) => {
    risk = new AdminRiskPage(page);
    await risk.goto();
    await expect(risk.title).toBeVisible({ timeout: 15_000 });
  });

  test('page renders with title', async () => {
    await expect(risk.title).toBeVisible();
  });

  test('flagged players tab shows data', async () => {
    await expect(risk.flaggedTab).toBeVisible();
    await expect(risk.table).toBeVisible({ timeout: 15_000 });
    const rowCount = await risk.tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('AML alerts tab is available', async () => {
    await risk.amlTab.click();
    await expect(risk.table).toBeVisible({ timeout: 10_000 });
  });

  test('duplicate detection tab is available', async () => {
    await risk.duplicatesTab.click();
    await expect(risk.table).toBeVisible({ timeout: 10_000 });
  });
});
