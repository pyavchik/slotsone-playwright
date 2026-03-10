import { test, expect } from '@playwright/test';
import { AmericanRoulettePage } from '../../pages/american-roulette.page';
import { mockAmericanRouletteApis } from '../../fixtures/helpers';

test.describe('American Roulette', () => {
  let roulette: AmericanRoulettePage;

  test.beforeEach(async ({ page, context }) => {
    await mockAmericanRouletteApis(context);
    roulette = new AmericanRoulettePage(page);
    await roulette.goto();
    await roulette.spinButton.waitFor({ timeout: 15_000 });
  });

  // ── Initialization ──────────────────────────────────────────────────

  test('page loads with table, wheel, and spin button', async () => {
    await expect(roulette.table).toBeVisible();
    await expect(roulette.wheelPanel).toBeVisible();
    await expect(roulette.spinButton).toBeVisible();
  });

  test('HUD displays balance', async () => {
    await expect(roulette.balanceDisplay).toBeVisible();
    // Balance may be formatted as "1,000" or "1000"
    await expect(roulette.balanceDisplay).toContainText(/1[,.]?000/);
  });

  test('has both 0 and 00 cells', async () => {
    await expect(roulette.zeroCell).toBeVisible();
    await expect(roulette.doubleZeroCell).toBeVisible();
  });

  // ── Chips ───────────────────────────────────────────────────────────

  test('chip selector shows denominations', async () => {
    await expect(roulette.chips.first()).toBeVisible();
    const count = await roulette.chips.count();
    expect(count).toBe(6); // $1, $5, $10, $25, $100, $500
  });

  test('selecting a chip highlights it', async () => {
    await roulette.selectChip(5);
    await expect(roulette.selectedChip).toBeVisible();
  });

  // ── Betting ─────────────────────────────────────────────────────────

  test('placing bet on 0 shows badge', async () => {
    await roulette.selectChip(1);
    await roulette.betOnZero();
    await expect(roulette.betBadges.first()).toBeVisible();
  });

  test('placing bet on 00 shows badge', async () => {
    await roulette.selectChip(1);
    await roulette.betOnDoubleZero();
    await expect(roulette.betBadges.first()).toBeVisible();
  });

  test('undo removes last bet', async () => {
    await roulette.selectChip(1);
    await roulette.betOnZero();
    await expect(roulette.betBadges).toHaveCount(1);

    await roulette.undoButton.click();
    await expect(roulette.betBadges).toHaveCount(0);
  });

  test('clear removes all bets', async () => {
    await roulette.selectChip(1);
    await roulette.betOnZero();
    await roulette.betOnDoubleZero();

    await roulette.clearButton.click();
    await expect(roulette.betBadges).toHaveCount(0);
  });

  // ── Spin flow ───────────────────────────────────────────────────────

  test('spin completes and shows result', async () => {
    await roulette.selectChip(1);
    await roulette.betOnZero();
    await roulette.spin();

    await expect(roulette.resultDisplay).toBeVisible({ timeout: 20_000 });
  });

  // ── Actions ─────────────────────────────────────────────────────────

  test('action buttons are visible', async () => {
    await expect(roulette.undoButton).toBeVisible();
    await expect(roulette.clearButton).toBeVisible();
    await expect(roulette.rebetButton).toBeVisible();
    await expect(roulette.doubleButton).toBeVisible();
  });

  // ── Navigation ────────────────────────────────────────────────────

  test('lobby button navigates back to /slots', async ({ page }) => {
    await roulette.lobbyButton.click();
    await expect(page).toHaveURL(/\/slots$/);
  });

  // ── Payout guide ──────────────────────────────────────────────────

  test('payout guide is visible', async () => {
    await expect(roulette.payoutGuide).toBeVisible();
  });
});
