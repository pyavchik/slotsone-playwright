import { test, expect } from '../base.fixture';
import { LobbyPage } from '../../pages/lobby.page';
import { mockAuth, mockImages } from '../../fixtures/helpers';

test.describe('Game Lobby', () => {
  let lobby: LobbyPage;

  test.beforeEach(async ({ page, context }) => {
    await mockAuth(context);
    await mockImages(context);
    lobby = new LobbyPage(page);
    await lobby.goto();
  });

  // ── Basic rendering ─────────────────────────────────────────────────

  test('loads and displays game cards', async () => {
    await expect(lobby.gameCards.first()).toBeVisible();
    await expect(lobby.gameCards).not.toHaveCount(0);
  });

  test('lobby brand is visible', async () => {
    await expect(lobby.brand).toBeVisible();
  });

  test('game cards show titles', async () => {
    await expect(lobby.gameCardTitles.first()).toBeVisible();
    await expect(lobby.gameCardTitles.first()).not.toBeEmpty();
  });

  // ── Navigation ──────────────────────────────────────────────────────

  test('clicking a game navigates to game page', async ({ page, context }) => {
    await context.route('**/api/v1/game/init', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          session_id: 'sess_e2e_nav',
          game_id: 'slot_mega_fortune_001',
          config: { reels: 5, rows: 3 },
          balance: { amount: 1000, currency: 'USD' },
          expires_at: new Date(Date.now() + 3600_000).toISOString(),
        }),
      }),
    );

    await lobby.clickGame('Mega Fortune');
    await expect(page).toHaveURL(/\/slots\/mega-fortune/);
  });

  // ── Category tabs ───────────────────────────────────────────────────

  test('category tabs are visible', async () => {
    await expect(lobby.categoryTab('Slots')).toBeVisible();
    await expect(lobby.categoryTab('Roulette')).toBeVisible();
    await expect(lobby.categoryTab('Blackjack')).toBeVisible();
    await expect(lobby.categoryTab('Baccarat')).toBeVisible();
  });

  test('Slots tab is active by default', async () => {
    const slotsTab = lobby.categoryTab('Slots');
    await expect(slotsTab).toHaveAttribute('aria-selected', 'true');
  });

  test('switching to Roulette shows roulette games', async () => {
    await lobby.switchCategory('Roulette');

    await expect(lobby.categoryTab('Roulette')).toHaveAttribute('aria-selected', 'true');
    await expect(lobby.gameCardByTitle('European Roulette')).toBeVisible();
  });

  test('switching categories changes displayed games', async () => {
    // Count games on Slots tab
    const slotsCount = await lobby.gameCards.count();

    // Switch to Roulette
    await lobby.switchCategory('Roulette');
    await expect(lobby.categoryTab('Roulette')).toHaveAttribute('aria-selected', 'true');
    const rouletteCount = await lobby.gameCards.count();

    // Categories should have different game counts
    expect(rouletteCount).not.toBe(slotsCount);
  });
});
