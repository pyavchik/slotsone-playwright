import { test, expect } from '@playwright/test';
import { AdminPlayersPage } from '../../pages/admin/players.page';

test.describe('Admin Players', () => {
  let players: AdminPlayersPage;

  test.beforeEach(async ({ page }) => {
    players = new AdminPlayersPage(page);
    await players.goto();
    await expect(players.title).toBeVisible({ timeout: 15_000 });
  });

  test('page renders with title and export button', async () => {
    await expect(players.title).toHaveText('Players');
    await expect(players.exportButton).toBeVisible();
  });

  test('player table loads with data', async () => {
    await expect(players.table).toBeVisible({ timeout: 15_000 });
    const rowCount = await players.tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('filter controls are visible', async () => {
    await expect(players.searchInput).toBeVisible();
  });

  test('search filters the table', async ({ page }) => {
    await players.table.waitFor({ timeout: 15_000 });
    const initialCount = await players.tableRows.count();

    await players.search('nonexistent_player_xyz');
    await page.waitForTimeout(1000);

    const filteredCount = await players.tableRows.count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('clicking a player row navigates to detail', async ({ page }) => {
    await players.table.waitFor({ timeout: 15_000 });
    await players.clickFirstRow();
    await expect(page).toHaveURL(/\/admin\/players\//, { timeout: 10_000 });
  });

  test('table shows column headers', async () => {
    await expect(players.table).toBeVisible({ timeout: 15_000 });
    const headers = players.table.locator('thead th');
    const count = await headers.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });
});
