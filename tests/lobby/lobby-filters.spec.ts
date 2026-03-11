import { test, expect } from '../base.fixture';
import { LobbyPage } from '../../pages/lobby.page';
import { mockAuth, mockImages } from '../../fixtures/helpers';

test.describe('Lobby Filters & Search', () => {
  let lobby: LobbyPage;

  test.beforeEach(async ({ page, context }) => {
    await mockAuth(context);
    await mockImages(context);
    lobby = new LobbyPage(page);
    await lobby.goto();
    await expect(lobby.gameCards.first()).toBeVisible();
  });

  // ── Search ────────────────────────────────────────────────────────────

  test('search input is visible with placeholder', async () => {
    await expect(lobby.searchInput).toBeVisible();
    await expect(lobby.searchInput).toHaveAttribute('placeholder', /search/i);
  });

  test('search filters games by title', async () => {
    const countBefore = await lobby.gameCards.count();

    await lobby.search('Mega Fortune');
    await expect(lobby.gameCardByTitle('Mega Fortune')).toBeVisible();

    const countAfter = await lobby.gameCards.count();
    expect(countAfter).toBeLessThan(countBefore);
  });

  test('search with no results shows empty state', async () => {
    await lobby.search('xyznonexistentgame123');
    await expect(lobby.emptyGrid).toBeVisible();
  });

  test('clearing search restores all games', async () => {
    const countBefore = await lobby.gameCards.count();

    await lobby.search('Mega Fortune');
    const countFiltered = await lobby.gameCards.count();
    expect(countFiltered).toBeLessThan(countBefore);

    await lobby.searchClear.click();
    await expect(lobby.gameCards).toHaveCount(countBefore);
  });

  // ── Provider filter ───────────────────────────────────────────────────

  test('provider dropdown is visible', async () => {
    await expect(lobby.providerSelect).toBeVisible();
  });

  test('selecting a provider filters games', async () => {
    const countBefore = await lobby.gameCards.count();

    await lobby.selectProvider('SlotsOne');
    const countAfter = await lobby.gameCards.count();

    expect(countAfter).toBeLessThanOrEqual(countBefore);
    expect(countAfter).toBeGreaterThan(0);
  });

  // ── Volatility filter ─────────────────────────────────────────────────

  test('volatility dropdown is visible', async () => {
    await expect(lobby.volatilitySelect).toBeVisible();
  });

  test('selecting volatility filters games', async () => {
    const countBefore = await lobby.gameCards.count();

    await lobby.selectVolatility('High');
    const countAfter = await lobby.gameCards.count();

    expect(countAfter).toBeLessThanOrEqual(countBefore);
  });

  // ── Sort ──────────────────────────────────────────────────────────────

  test('sort dropdown is visible', async () => {
    await expect(lobby.sortSelect).toBeVisible();
  });

  test('sorting by name A-Z reorders games', async () => {
    await lobby.selectSort('Name A-Z');

    const titles = await lobby.gameCardTitles.allTextContents();
    const sorted = [...titles].sort((a, b) => a.localeCompare(b));
    expect(titles).toEqual(sorted);
  });

  // ── Clear all ─────────────────────────────────────────────────────────

  test('clear all resets all filters', async () => {
    const countBefore = await lobby.gameCards.count();

    // Apply search + volatility
    await lobby.search('fortune');
    await lobby.selectVolatility('High');

    await expect(lobby.clearAllButton).toBeVisible();
    await lobby.clearAllButton.click();

    await expect(lobby.gameCards).toHaveCount(countBefore);
    await expect(lobby.searchInput).toHaveValue('');
  });
});
