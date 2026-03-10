import type { Locator, Page } from '@playwright/test';

export class GamePage {
  readonly canvas: Locator;
  readonly spinButton: Locator;
  readonly betPanel: Locator;
  readonly betValue: Locator;
  readonly betQuickButtons: Locator;
  readonly increaseBet: Locator;
  readonly decreaseBet: Locator;
  readonly balance: Locator;
  readonly winBadge: Locator;
  readonly noWinBadge: Locator;
  readonly winOverlay: Locator;
  readonly winOverlayTitle: Locator;
  readonly winOverlayAmount: Locator;

  // HUD navigation
  readonly lobbyButton: Locator;
  readonly historyButton: Locator;
  readonly logoutButton: Locator;

  // Paytable
  readonly paytableBackdrop: Locator;
  readonly paytableContainer: Locator;
  readonly paytableClose: Locator;
  readonly paytableNavDots: Locator;
  readonly paytableNextArrow: Locator;
  readonly paytablePrevArrow: Locator;
  readonly infoButton: Locator;

  // Error toast
  readonly errorToast: Locator;
  readonly errorMessage: Locator;
  readonly retryButton: Locator;
  readonly dismissButton: Locator;

  constructor(private page: Page) {
    this.canvas = page.locator('canvas');
    this.spinButton = page.getByRole('button', { name: /spin/i });
    this.betPanel = page.locator('.bet-panel');
    this.betValue = page.locator('.bet-value').first();
    this.betQuickButtons = page.locator('.bet-quick');
    this.increaseBet = page.getByLabel('Increase bet');
    this.decreaseBet = page.getByLabel('Decrease bet');
    this.balance = page.getByTestId('hud-balance');
    this.winBadge = page.getByTestId('hud-win-badge');
    this.noWinBadge = page.getByTestId('hud-nowin-badge');
    this.winOverlay = page.locator('.win-overlay');
    this.winOverlayTitle = page.locator('.win-overlay-title');
    this.winOverlayAmount = page.locator('.win-overlay-amount');

    this.lobbyButton = page.getByLabel('Back to Lobby');
    this.historyButton = page.getByLabel('Game History');
    this.logoutButton = page.getByLabel('Logout');

    // Paytable
    this.paytableBackdrop = page.locator('.pt-backdrop');
    this.paytableContainer = page.locator('.pt-container');
    this.paytableClose = page.locator('.pt-close');
    this.paytableNavDots = page.locator('.pt-nav-dot');
    this.paytableNextArrow = page.locator('.pt-nav-arrow').last();
    this.paytablePrevArrow = page.locator('.pt-nav-arrow').first();
    this.infoButton = page.getByLabel(/info|paytable/i);

    // Error toast
    this.errorToast = page.locator('.slots-error-toast');
    this.errorMessage = page.locator('.slots-error-message');
    this.retryButton = page.locator('.slots-error-btn-retry');
    this.dismissButton = page.locator('.slots-error-btn-dismiss');
  }

  async goto(slug: string) {
    await this.page.goto(`/slots/${slug}`);
  }

  async spin() {
    await this.spinButton.click();
  }

  async spinWithKeyboard() {
    await this.page.keyboard.press('Space');
  }

  async openPaytable() {
    await this.infoButton.click();
  }
}
