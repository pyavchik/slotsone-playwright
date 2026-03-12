import { test, expect } from '@playwright/test';
import { GamePage } from '../../pages/game.page';
import { mockGameApis } from '../../fixtures/helpers';

test.describe('Keyboard Controls', () => {
  let game: GamePage;

  test.beforeEach(async ({ page, context }) => {
    await mockGameApis(context);
    game = new GamePage(page);
    await game.goto('mega-fortune');
    await game.spinButton.waitFor();
  });

  test('spacebar triggers spin', async ({ page }) => {
    let spinRequests = 0;
    await page.route('**/api/v1/spin', (route) => {
      spinRequests++;
      route.continue();
    });

    await game.spinWithKeyboard();
    await expect.poll(() => spinRequests).toBe(1);
  });

  test('spacebar does not trigger spin when paytable is open', async ({ page }) => {
    let spinRequests = 0;
    await page.route('**/api/v1/spin', (route) => {
      spinRequests++;
      route.continue();
    });

    await game.openPaytable();
    await expect(game.paytableBackdrop).toBeVisible();

    await page.keyboard.press('Space');
    // Verify no spin request fires — poll briefly to catch any async dispatch
    await expect.poll(() => spinRequests, { timeout: 1000 }).toBe(0);
  });

  test('escape closes paytable', async ({ page }) => {
    await game.openPaytable();
    await expect(game.paytableBackdrop).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(game.paytableBackdrop).not.toBeVisible();
  });
});
