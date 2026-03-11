import { test, expect } from '../base.fixture';
import { AdminReportsPage } from '../../pages/admin/reports.page';

test.describe('Admin Reports', () => {
  let reports: AdminReportsPage;

  test.beforeEach(async ({ page }) => {
    reports = new AdminReportsPage(page);
    await reports.goto();
    await expect(reports.title).toBeVisible({ timeout: 15_000 });
  });

  test('page renders with title', async () => {
    await expect(reports.title).toHaveText('Reports');
  });

  test('financial tab shows summary and table', async () => {
    await expect(reports.financialTab).toBeVisible();
    await expect(reports.breakdownTable).toBeVisible({ timeout: 15_000 });
  });

  test('players tab shows registration data', async () => {
    await reports.playersTab.click();
    await expect(reports.registrationTable).toBeVisible({ timeout: 10_000 });
  });

  test('games tab shows performance data', async () => {
    await reports.gamesTab.click();
    await expect(reports.gamesTable).toBeVisible({ timeout: 10_000 });
  });

  test('period selector is available', async () => {
    await expect(reports.periodSelect).toBeVisible();
  });
});
