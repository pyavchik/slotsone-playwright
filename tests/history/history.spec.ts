import { test, expect } from '../base.fixture';
import { HistoryPage } from '../../pages/history.page';
import { mockHistoryApis } from '../../fixtures/helpers';

test.describe('Game History @allure.label.parentSuite:History @allure.label.suite:Game History', () => {
  let history: HistoryPage;

  test.beforeEach(async ({ page, context }) => {
    await mockHistoryApis(context);
    history = new HistoryPage(page);
    await history.goto();
    await expect(history.table).toBeVisible({ timeout: 10_000 });
  });

  // ── Rendering ───────────────────────────────────────────────────────

  test('history page loads with title', async () => {
    await expect(history.title).toBeVisible();
  });

  test('summary cards are displayed', async () => {
    await expect(history.summaryCards).toHaveCount(5);
    await expect(history.totalRounds).toContainText('25');
  });

  test('history table shows rows', async () => {
    const rowCount = await history.tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('each row has a details link', async () => {
    await expect(history.detailLinks.first()).toBeVisible();
  });

  // ── Summary values ────────────────────────────────────────────────

  test('summary shows total wagered', async () => {
    await expect(history.totalWagered).toContainText('25');
  });

  test('summary shows total won', async () => {
    await expect(history.totalWon).toContainText('18');
  });

  test('summary shows net result', async () => {
    await expect(history.netResult).toBeVisible();
  });

  test('summary shows biggest win', async () => {
    await expect(history.biggestWin).toContainText('12');
  });

  // ── Filters ─────────────────────────────────────────────────────────

  test('filters toggle shows filter controls', async () => {
    await history.toggleFilters();
    await expect(history.filtersSection).toBeVisible();
    await expect(history.resultFilter).toBeVisible();
    await expect(history.applyButton).toBeVisible();
  });

  test('filter by result type', async ({ context }) => {
    // Mock filtered response with fewer items
    let filterCalled = false;
    await context.route('**/api/v1/history?*result=win*', (route) => {
      filterCalled = true;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [
            {
              spin_id: 'spin_win_1',
              timestamp: Date.now(),
              bet: { amount: 1, lines: 20 },
              outcome: { win: { amount: 2.5 }, bonus_triggered: false },
            },
          ],
          total: 1,
          summary: {
            total_rounds: 1,
            total_wagered: 1,
            total_won: 2.5,
            net_result: 1.5,
            biggest_win: 2.5,
          },
        }),
      });
    });

    await history.toggleFilters();
    await history.resultFilter.selectOption('win');
    await history.applyFilters();

    // Wait for re-fetch
    await expect.poll(() => filterCalled).toBe(true);
  });

  test('clear filters resets form', async () => {
    await history.toggleFilters();
    await history.resultFilter.selectOption('win');
    await history.clearFilters();

    await expect(history.resultFilter).toHaveValue('all');
  });

  // ── Pagination ────────────────────────────────────────────────────

  test('pagination is displayed', async () => {
    await expect(history.pagination).toBeVisible();
    await expect(history.pageInfo).toContainText('Page');
  });

  test('prev button is disabled on first page', async () => {
    await expect(history.prevButton).toBeDisabled();
  });

  // ── Navigation ────────────────────────────────────────────────────

  test('details link navigates to round page', async ({ page }) => {
    await history.openRound(0);
    await expect(page).toHaveURL(/\/round\//);
  });

  test('back button navigates away', async ({ page }) => {
    await history.backButton.click();
    await expect(page).not.toHaveURL(/\/history/);
  });
});
