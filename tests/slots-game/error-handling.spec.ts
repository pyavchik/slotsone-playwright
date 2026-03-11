import { test, expect } from '../base.fixture';
import { GamePage } from '../../pages/game.page';
import {
  mockAuth,
  mockGameInit,
  mockImages,
  mockSpinError,
  mockGameInitError,
} from '../../fixtures/helpers';
import { makeGameInitResponse } from '../../fixtures/mock-data';

test.describe('Error Handling', () => {
  // ── Spin errors ───────────────────────────────────────────────────────

  test.describe('Spin Errors', () => {
    let game: GamePage;

    test.beforeEach(async ({ page, context }) => {
      await mockAuth(context);
      await mockGameInit(context);
      await mockImages(context);
      await mockSpinError(context);
      game = new GamePage(page);
      await game.goto('mega-fortune');
      await game.spinButton.waitFor();
    });

    test('error toast appears on spin failure', async () => {
      await game.spin();
      await expect(game.errorToast).toBeVisible({ timeout: 10_000 });
      await expect(game.errorMessage).toBeVisible();
    });

    test('dismiss button hides error toast', async () => {
      await game.spin();
      await expect(game.errorToast).toBeVisible({ timeout: 10_000 });

      await game.dismissButton.click();
      await expect(game.errorToast).not.toBeVisible();
    });

    test('error toast auto-dismisses after timeout', async () => {
      await game.spin();
      await expect(game.errorToast).toBeVisible({ timeout: 10_000 });

      // Auto-dismiss after ~5 seconds
      await expect(game.errorToast).not.toBeVisible({ timeout: 25_000 });
    });
  });

  // ── Init errors ───────────────────────────────────────────────────────

  test.describe('Game Init Errors', () => {
    test('error shown when game init fails', async ({ page, context }) => {
      await mockAuth(context);
      await mockGameInitError(context);
      await mockImages(context);

      const game = new GamePage(page);
      await game.goto('mega-fortune');

      await expect(game.errorToast).toBeVisible({ timeout: 10_000 });
    });

    test('retry button re-initializes game', async ({ page, context }) => {
      await mockAuth(context);
      await mockImages(context);

      let initCalls = 0;
      await context.route('**/api/v1/game/init', (route) => {
        initCalls++;
        if (initCalls === 1) {
          // First call: fail
          route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: '{"error":"init failed"}',
          });
        } else {
          // Subsequent calls: succeed with full config
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(makeGameInitResponse()),
          });
        }
      });

      const game = new GamePage(page);
      await game.goto('mega-fortune');

      await expect(game.errorToast).toBeVisible({ timeout: 10_000 });
      await game.retryButton.click();

      // After retry, game should initialize
      await expect(game.spinButton).toBeVisible({ timeout: 10_000 });
      expect(initCalls).toBe(2);
    });
  });

  // ── Auth error during spin ────────────────────────────────────────────

  test('401 on spin redirects to login', async ({ page, context }) => {
    await mockAuth(context);
    await mockGameInit(context);
    await mockImages(context);

    const game = new GamePage(page);
    await game.goto('mega-fortune');
    await game.spinButton.waitFor();

    // Mock spin to return 401
    await page.route('**/api/v1/spin', (route) =>
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: '{"error":"unauthorized"}',
      }),
    );

    // Also fail auth refresh so login redirect sticks
    await context.unrouteAll();
    await context.route('**/api/v1/auth/refresh', (route) =>
      route.fulfill({ status: 401, body: '{"error":"expired"}' }),
    );

    await game.spin();
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });
});
