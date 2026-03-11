import { test, expect } from '../base.fixture';
import { AdminDashboardPage } from '../../pages/admin/dashboard.page';

test.describe('Admin Dashboard @allure.label.parentSuite:Admin_Panel @allure.label.suite:Dashboard', () => {
  let dashboard: AdminDashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboard = new AdminDashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.title).toBeVisible({ timeout: 15_000 });
  });

  test('page title and subtitle are visible', async () => {
    await expect(dashboard.title).toHaveText('Dashboard');
    await expect(dashboard.subtitle).toBeVisible();
  });

  test('four KPI cards are displayed', async () => {
    await expect(dashboard.totalPlayersCard).toBeVisible();
    await expect(dashboard.totalBetsCard).toBeVisible();
    await expect(dashboard.totalWinsCard).toBeVisible();
    await expect(dashboard.ggrCard).toBeVisible();
  });

  test('alert cards are displayed', async () => {
    await expect(dashboard.pendingKycCard).toBeVisible();
    await expect(dashboard.highRiskCard).toBeVisible();
  });

  test('recent transactions table is visible', async () => {
    await expect(dashboard.recentTxTable).toBeVisible();
  });

  test('sidebar shows all navigation items', async () => {
    const navLabels = ['Dashboard', 'Players', 'Transactions', 'Games', 'Bonuses', 'KYC', 'Risk', 'Reports', 'Settings'];
    for (const label of navLabels) {
      await expect(dashboard.sidebar.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test('user avatar menu is accessible', async ({ page }) => {
    await dashboard.avatarButton.click();
    await expect(page.getByText('Sign out')).toBeVisible();
  });
});
