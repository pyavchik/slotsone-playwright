import { test, expect } from '../base.fixture';
import { GamePage } from '../../pages/game.page';
import { mockGameApis, mockLogout } from '../../fixtures/helpers';
import { makeSpinResponse } from '../../fixtures/mock-data';

test.describe('Slots Game @allure.label.parentSuite:Slots_Game @allure.label.suite:Gameplay', () => {
  let game: GamePage;

  test.beforeEach(async ({ page, context }) => {
    await mockGameApis(context);
    game = new GamePage(page);
    await game.goto('mega-fortune');
    await game.spinButton.waitFor();
  });

  // ── Initialization ──────────────────────────────────────────────────

  test('game initializes with canvas and spin button', async () => {
    await expect(game.canvas).toBeVisible();
    await expect(game.spinButton).toBeVisible();
    await expect(game.balance).toBeVisible();
    await expect(game.balance).toContainText('USD');
  });

  // ── Spin flow ───────────────────────────────────────────────────────

  test('full spin flow completes', async ({ page }) => {
    let spinRequests = 0;
    await page.route('**/api/v1/spin', (route) => {
      spinRequests++;
      route.continue();
    });

    await expect(game.spinButton).toBeVisible();
    await game.spin();

    await expect.poll(() => spinRequests).toBe(1);
  });

  // Known flaky: BUG-001 race condition (PR #40) can cause stale reel state
  test('win badge appears after winning spin', async () => {
    // mockGameApis already mocks spin with a winning response
    await game.spin();

    // Win badge appears after reel animation (can take up to 20s)
    await expect(game.winBadge).toBeVisible({ timeout: 20_000 });
    await expect(game.winBadge).toContainText('WIN');
  });

  // ── Bet panel ───────────────────────────────────────────────────────

  test('bet panel displays current bet value', async () => {
    await expect(game.betPanel).toBeVisible();
    await expect(game.betValue).toBeVisible();
    await expect(game.betValue).not.toBeEmpty();
  });

  test('increase bet changes bet value', async () => {
    await expect(game.betValue).toBeVisible();
    const initialBet = await game.betValue.textContent();

    await game.increaseBet.click();
    await expect(game.betValue).not.toHaveText(initialBet!);
  });

  test('decrease bet after increase restores value', async () => {
    await expect(game.betValue).toBeVisible();
    const initialBet = await game.betValue.textContent();

    await game.increaseBet.click();
    await expect(game.betValue).not.toHaveText(initialBet!);

    await game.decreaseBet.click();
    await expect(game.betValue).toHaveText(initialBet!);
  });

  test('quick bet buttons are visible', async () => {
    await expect(game.betQuickButtons.first()).toBeVisible();
    const count = await game.betQuickButtons.count();
    expect(count).toBeGreaterThan(1);
  });

  test('quick bet button updates bet value', async () => {
    await expect(game.betValue).toBeVisible();
    const initialBet = await game.betValue.textContent();

    // Click the last quick bet button (highest value)
    await game.betQuickButtons.last().click();
    await expect(game.betValue).not.toHaveText(initialBet!);
  });

  // ── Balance ─────────────────────────────────────────────────────────

  test('balance updates after spin', async () => {
    const initialBalance = await game.balance.textContent();
    await game.spin();

    // After spin completes, balance should change from initial value
    await expect(game.balance).not.toHaveText(initialBalance!, { timeout: 15_000 });
  });

  // ── HUD navigation ─────────────────────────────────────────────────

  test('lobby button navigates back to /slots', async ({ page }) => {
    await expect(game.lobbyButton).toBeVisible();
    await game.lobbyButton.click();

    await expect(page).toHaveURL(/\/slots$/);
  });

  test('history button navigates to /history', async ({ page }) => {
    await expect(game.historyButton).toBeVisible();
    await game.historyButton.click();

    await expect(page).toHaveURL(/\/history/);
  });

  test('logout button redirects to login', async ({ page, context }) => {
    await mockLogout(context);
    await game.logoutButton.click();

    // After logout, prevent re-authentication via refresh mock
    await context.unrouteAll();
    await context.route('**/api/v1/auth/refresh', (route) =>
      route.fulfill({ status: 401, body: '{"error":"logged_out"}' }),
    );

    await expect(page).toHaveURL(/\/login/);
  });
});
