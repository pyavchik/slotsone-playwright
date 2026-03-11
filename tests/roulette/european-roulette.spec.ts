import { test, expect } from '../base.fixture';
import { RoulettePage } from '../../pages/roulette.page';
import { mockRouletteApis } from '../../fixtures/helpers';

test.describe('European Roulette @allure.label.parentSuite:Roulette @allure.label.suite:European Roulette', () => {
  let roulette: RoulettePage;

  test.beforeEach(async ({ page, context }) => {
    await mockRouletteApis(context);
    roulette = new RoulettePage(page);
    await roulette.goto();
    await roulette.spinButton.waitFor({ timeout: 15_000 });
  });

  // ── Initialization ──────────────────────────────────────────────────

  test('page loads with betting table and wheel', async () => {
    await expect(roulette.bettingTable).toBeVisible();
    await expect(roulette.wheelArea).toBeVisible();
    await expect(roulette.spinButton).toBeVisible();
  });

  test('balance is displayed', async () => {
    await expect(roulette.balancePill).toBeVisible();
  });

  test('chip rack shows available denominations', async () => {
    await expect(roulette.chipButtons.first()).toBeVisible();
    const count = await roulette.chipButtons.count();
    expect(count).toBe(6);
  });

  // ── Betting ─────────────────────────────────────────────────────────

  test('selecting a chip highlights it', async () => {
    await roulette.selectChip(5);
    await expect(roulette.selectedChip).toBeVisible();
  });

  test('placing bet on zero shows bet display', async () => {
    await roulette.selectChip(1);
    await roulette.betOnZero();
    await expect(roulette.betDisplay).toBeVisible();
  });

  test('undo removes last bet', async () => {
    await roulette.selectChip(1);
    await roulette.betOnZero();
    await expect(roulette.betDisplay).toBeVisible();

    await roulette.undoButton.click();
    // Bet display disappears when total is 0
    await expect(roulette.betDisplay).not.toBeVisible();
  });

  test('reset clears all bets', async () => {
    await roulette.selectChip(1);
    await roulette.betOnZero();
    await roulette.betOnNumber(17);

    await roulette.resetButton.click();
    await expect(roulette.betDisplay).not.toBeVisible();
  });

  // ── Spin flow ───────────────────────────────────────────────────────

  test('spin completes and shows result', async () => {
    await roulette.selectChip(1);
    await roulette.betOnNumber(17);
    await roulette.spin();

    // Result panel appears after wheel animation
    await expect(roulette.resultPanel).toBeVisible({ timeout: 20_000 });
  });

  test('balance updates after spin', async () => {
    const initialBalance = await roulette.balancePill.textContent();
    await roulette.selectChip(1);
    await roulette.betOnNumber(17);
    await roulette.spin();

    await expect(roulette.resultPanel).toBeVisible({ timeout: 20_000 });
    await expect(roulette.balancePill).not.toHaveText(initialBalance!);
  });

  // ── Controls ────────────────────────────────────────────────────────

  test('spin button is visible', async () => {
    await expect(roulette.spinButton).toBeVisible();
  });

  test('lobby button navigates back to /slots', async ({ page }) => {
    await roulette.lobbyButton.click();
    await expect(page).toHaveURL(/\/slots$/);
  });

  // ── Racetrack / Announced bets ──────────────────────────────────────

  test('racetrack tab shows announced bet options', async () => {
    await roulette.racetrackTab.click();

    await expect(roulette.voisinsButton).toBeVisible();
    await expect(roulette.tiersButton).toBeVisible();
    await expect(roulette.orphelinsButton).toBeVisible();
  });
});
