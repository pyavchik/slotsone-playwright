import { test, expect } from '../base.fixture';
import { GamePage } from '../../pages/game.page';
import { mockAuth, mockGameInit, mockImages } from '../../fixtures/helpers';
import {
  makeNoWinSpinResponse,
  makeSpinResponse,
  makeNiceWinSpinResponse,
  makeBigWinSpinResponse,
  makeMegaWinSpinResponse,
  makeUltraWinSpinResponse,
} from '../../fixtures/mock-data';

// These tests involve PixiJS reel animations — overlay is transient (~3s)
// so we start watching for it BEFORE spinning to avoid missing it.
// Known flakiness: BUG-001 race condition (PR #40) causes stale reel state,
// which can delay or skip the win overlay on some runs.
test.describe('Win Overlay Tiers @allure.label.parentSuite:Slots_Game @allure.label.suite:Win Overlay', () => {
  test.describe.configure({ timeout: 60_000, retries: 1 });
  let game: GamePage;

  test.beforeEach(async ({ page, context }) => {
    await mockAuth(context);
    await mockGameInit(context);
    await mockImages(context);
    game = new GamePage(page);
  });

  test('no overlay on losing spin', async ({ page }) => {
    await page.route('**/api/v1/spin', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(makeNoWinSpinResponse()),
      }),
    );

    await game.goto('mega-fortune');
    await game.spinButton.waitFor();

    // Track if overlay ever appeared
    const overlayAppeared = page.evaluate(() =>
      new Promise<boolean>((resolve) => {
        const observer = new MutationObserver(() => {
          if (document.querySelector('.win-overlay')) {
            observer.disconnect();
            resolve(true);
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        // Resolve false after timeout
        setTimeout(() => { observer.disconnect(); resolve(false); }, 20_000);
      }),
    );

    await game.spin();

    // Wait for balance to update (spin completed + reels stopped)
    await expect(game.balance).not.toContainText('1000.00', { timeout: 30_000 });
    expect(await overlayAppeared).toBe(false);
  });

  test('NICE WIN overlay for 3x-8x multiplier', async ({ page }) => {
    await page.route('**/api/v1/spin', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(makeNiceWinSpinResponse()),
      }),
    );

    await game.goto('mega-fortune');
    await game.spinButton.waitFor();

    // Watch for overlay before spinning so we don't miss the transient element
    const overlayHandle = page.waitForSelector('.win-overlay', { timeout: 30_000 });
    await game.spin();
    const overlay = await overlayHandle;
    expect(overlay).toBeTruthy();

    // Verify title
    const title = await page.locator('.win-overlay-title').textContent();
    expect(title?.toLowerCase()).toContain('nice win');
  });

  test('BIG WIN overlay for 8x-18x multiplier', async ({ page }) => {
    await page.route('**/api/v1/spin', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(makeBigWinSpinResponse()),
      }),
    );

    await game.goto('mega-fortune');
    await game.spinButton.waitFor();

    const overlayHandle = page.waitForSelector('.win-overlay', { timeout: 30_000 });
    await game.spin();
    const overlay = await overlayHandle;
    expect(overlay).toBeTruthy();

    const title = await page.locator('.win-overlay-title').textContent();
    expect(title?.toLowerCase()).toContain('big win');
  });

  test('MEGA WIN overlay for 18x-40x multiplier', async ({ page }) => {
    await page.route('**/api/v1/spin', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(makeMegaWinSpinResponse()),
      }),
    );

    await game.goto('mega-fortune');
    await game.spinButton.waitFor();

    const overlayHandle = page.waitForSelector('.win-overlay', { timeout: 30_000 });
    await game.spin();
    const overlay = await overlayHandle;
    expect(overlay).toBeTruthy();

    const title = await page.locator('.win-overlay-title').textContent();
    expect(title?.toLowerCase()).toContain('mega win');
  });

  test('ULTRA WIN overlay for 40x+ multiplier', async ({ page }) => {
    await page.route('**/api/v1/spin', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(makeUltraWinSpinResponse()),
      }),
    );

    await game.goto('mega-fortune');
    await game.spinButton.waitFor();

    const overlayHandle = page.waitForSelector('.win-overlay', { timeout: 30_000 });
    await game.spin();
    const overlay = await overlayHandle;
    expect(overlay).toBeTruthy();

    const title = await page.locator('.win-overlay-title').textContent();
    expect(title?.toLowerCase()).toContain('ultra win');
  });

  test('win overlay shows win amount', async ({ page }) => {
    await page.route('**/api/v1/spin', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(makeBigWinSpinResponse()),
      }),
    );

    await game.goto('mega-fortune');
    await game.spinButton.waitFor();

    const overlayHandle = page.waitForSelector('.win-overlay', { timeout: 30_000 });
    await game.spin();
    await overlayHandle;

    const amount = await page.locator('.win-overlay-amount').textContent();
    expect(amount).toContain('12.00');
  });

  test('small win does not trigger overlay', async ({ page }) => {
    // Win below 3x threshold (0.2x) — overlay should NOT appear
    await page.route('**/api/v1/spin', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(makeSpinResponse()),
      }),
    );

    await game.goto('mega-fortune');
    await game.spinButton.waitFor();

    // Track if overlay ever appeared
    const overlayAppeared = page.evaluate(() =>
      new Promise<boolean>((resolve) => {
        const observer = new MutationObserver(() => {
          if (document.querySelector('.win-overlay')) {
            observer.disconnect();
            resolve(true);
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => { observer.disconnect(); resolve(false); }, 20_000);
      }),
    );

    await game.spin();

    // Wait for win badge (confirms reel animation complete)
    await expect(game.winBadge).toBeVisible({ timeout: 30_000 });
    expect(await overlayAppeared).toBe(false);
  });
});
