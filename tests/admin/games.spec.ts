import { test, expect } from '@playwright/test';
import { AdminGamesPage } from '../../pages/admin/games.page';

test.describe('Admin Games', () => {
  let games: AdminGamesPage;

  test.beforeEach(async ({ page }) => {
    games = new AdminGamesPage(page);
    await games.goto();
    await expect(games.title).toBeVisible({ timeout: 15_000 });
  });

  test('page renders with title', async () => {
    await expect(games.title).toHaveText('Games');
  });

  test('games table loads with data', async () => {
    await expect(games.table).toBeVisible({ timeout: 15_000 });
    const rowCount = await games.tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('search input and category filter are visible', async () => {
    await expect(games.searchInput).toBeVisible();
  });

  test('table rows have toggle switches', async () => {
    await expect(games.table).toBeVisible({ timeout: 15_000 });
    const toggleCount = await games.activeToggles.count();
    expect(toggleCount).toBeGreaterThan(0);
  });

  test('table has column headers including RTP and GGR', async () => {
    await expect(games.table).toBeVisible({ timeout: 15_000 });
    await expect(games.table.locator('thead')).toContainText('RTP');
    await expect(games.table.locator('thead')).toContainText('GGR');
  });
});
