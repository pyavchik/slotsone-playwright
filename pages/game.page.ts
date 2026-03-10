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

  // HUD navigation
  readonly lobbyButton: Locator;
  readonly historyButton: Locator;
  readonly logoutButton: Locator;

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

    this.lobbyButton = page.getByLabel('Back to Lobby');
    this.historyButton = page.getByLabel('Game History');
    this.logoutButton = page.getByLabel('Logout');
  }

  async goto(slug: string) {
    await this.page.goto(`/slots/${slug}`);
  }

  async spin() {
    await this.spinButton.click();
  }
}
