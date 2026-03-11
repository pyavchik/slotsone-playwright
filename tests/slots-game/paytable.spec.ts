import { test, expect } from '../base.fixture';
import { GamePage } from '../../pages/game.page';
import { mockGameApis } from '../../fixtures/helpers';

test.describe('Paytable @allure.label.parentSuite:Slots_Game @allure.label.suite:Paytable', () => {
  let game: GamePage;

  test.beforeEach(async ({ page, context }) => {
    await mockGameApis(context);
    game = new GamePage(page);
    await game.goto('mega-fortune');
    await game.spinButton.waitFor();
  });

  test('info button opens paytable', async () => {
    await game.openPaytable();
    await expect(game.paytableBackdrop).toBeVisible();
    await expect(game.paytableContainer).toBeVisible();
  });

  test('paytable has 4 page indicators', async () => {
    await game.openPaytable();
    await expect(game.paytableNavDots).toHaveCount(4);
  });

  test('next arrow navigates to next page', async ({ page }) => {
    await game.openPaytable();

    // First page: Symbol Payouts
    await expect(page.locator('.pt-page')).toContainText(/symbol/i);

    await game.paytableNextArrow.click();
    // Second page: Special Symbols
    await expect(page.locator('.pt-page')).toContainText(/special/i);
  });

  test('can navigate through all pages', async () => {
    await game.openPaytable();

    // Navigate forward through all 4 pages
    await game.paytableNextArrow.hover();
    await game.paytableNextArrow.click();
    await game.paytableNextArrow.hover();
    await game.paytableNextArrow.click();
    await game.paytableNextArrow.hover();
    await game.paytableNextArrow.click();

    // Should be on last page, next arrow disabled
    await expect(game.paytableNextArrow).toBeDisabled();
  });

  test('prev arrow navigates back', async () => {
    await game.openPaytable();

    // Go to page 2, then back to page 1
    await game.paytableNextArrow.click();
    await game.paytablePrevArrow.click();

    // Should be on first page, prev arrow disabled
    await expect(game.paytablePrevArrow).toBeDisabled();
  });

  test('close button closes paytable', async () => {
    await game.openPaytable();
    await expect(game.paytableBackdrop).toBeVisible();

    await game.paytableClose.click();
    await expect(game.paytableBackdrop).not.toBeVisible();
  });

  test('clicking backdrop closes paytable', async ({ page }) => {
    await game.openPaytable();
    await expect(game.paytableBackdrop).toBeVisible();

    // Click on the backdrop (outside the container)
    await game.paytableBackdrop.click({ position: { x: 10, y: 10 } });
    await expect(game.paytableBackdrop).not.toBeVisible();
  });

  test('arrow keys navigate pages', async ({ page }) => {
    await game.openPaytable();

    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.pt-page')).toContainText(/special/i);

    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('.pt-page')).toContainText(/symbol/i);
  });
});
