import { test, expect } from '@playwright/test';
import { AdminPlayersPage } from '../../pages/admin/players.page';
import { AdminPlayerDetailPage } from '../../pages/admin/player-detail.page';

test.describe('Admin Player Detail', () => {
  let detail: AdminPlayerDetailPage;

  test.beforeEach(async ({ page }) => {
    // Navigate to first player's detail via players list
    const players = new AdminPlayersPage(page);
    await players.goto();
    await expect(players.table).toBeVisible({ timeout: 15_000 });
    await players.clickFirstRow();
    await expect(page).toHaveURL(/\/admin\/players\//, { timeout: 10_000 });

    detail = new AdminPlayerDetailPage(page);
  });

  test('player header displays username and badges', async () => {
    await expect(detail.username).toBeVisible();
    const badgeCount = await detail.badges.count();
    expect(badgeCount).toBeGreaterThanOrEqual(2);
  });

  test('stat cards are displayed', async () => {
    const statCount = await detail.statCards.count();
    expect(statCount).toBeGreaterThanOrEqual(3);
  });

  test('tabs are available for navigation', async () => {
    await expect(detail.tabsList).toBeVisible();
    await expect(detail.overviewTab).toBeVisible();
    await expect(detail.transactionsTab).toBeVisible();
  });

  test('switching to transactions tab shows table', async () => {
    await detail.transactionsTab.click();
    await expect(detail.tabTable).toBeVisible({ timeout: 10_000 });
  });

  test('back button navigates to players list', async ({ page }) => {
    await detail.backButton.click();
    await expect(page).toHaveURL(/\/admin\/players$/);
  });

  test('top-up button is visible', async () => {
    await expect(detail.topUpButton).toBeVisible();
  });
});
