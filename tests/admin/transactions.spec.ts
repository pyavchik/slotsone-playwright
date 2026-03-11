import { test, expect } from '../base.fixture';
import { AdminTransactionsPage } from '../../pages/admin/transactions.page';

test.describe('Admin Transactions @allure.label.parentSuite:Admin_Panel @allure.label.suite:Transactions', () => {
  let txns: AdminTransactionsPage;

  test.beforeEach(async ({ page }) => {
    txns = new AdminTransactionsPage(page);
    await txns.goto();
    await expect(txns.title).toBeVisible({ timeout: 15_000 });
  });

  test('page renders with title', async () => {
    await expect(txns.title).toHaveText('Transactions');
  });

  test('all transactions tab shows data table', async () => {
    await expect(txns.allTab).toBeVisible();
    await expect(txns.table).toBeVisible({ timeout: 15_000 });
    const rowCount = await txns.tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('pending withdrawals tab is available', async () => {
    await expect(txns.pendingTab).toBeVisible();
    await txns.pendingTab.click();
    await expect(txns.table).toBeVisible({ timeout: 10_000 });
  });

  test('search input is available', async () => {
    await expect(txns.searchInput).toBeVisible();
  });

  test('table has column headers', async () => {
    await expect(txns.table).toBeVisible({ timeout: 15_000 });
    const headers = txns.table.locator('thead th');
    const count = await headers.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });
});
