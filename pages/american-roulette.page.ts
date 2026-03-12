import type { Locator, Page } from '@playwright/test';

export class AmericanRoulettePage {
  // HUD
  readonly balanceDisplay: Locator;
  readonly totalBetDisplay: Locator;
  readonly lastWinDisplay: Locator;
  readonly lobbyButton: Locator;

  // Chips
  readonly chips: Locator;
  readonly selectedChip: Locator;

  // Betting table
  readonly table: Locator;
  readonly zeroCell: Locator;
  readonly doubleZeroCell: Locator;
  readonly numberCells: Locator;
  readonly betBadges: Locator;

  // Actions
  readonly spinButton: Locator;
  readonly undoButton: Locator;
  readonly clearButton: Locator;
  readonly rebetButton: Locator;
  readonly doubleButton: Locator;

  // Result
  readonly resultDisplay: Locator;

  // History strip
  readonly historyItems: Locator;

  // Wheel
  readonly wheelPanel: Locator;

  // Payout guide
  readonly payoutGuide: Locator;

  constructor(private page: Page) {
    this.balanceDisplay = page.locator('.ar-hud-item', { hasText: 'Balance' });
    this.totalBetDisplay = page.locator('.ar-hud-item', { hasText: 'Total Bet' });
    this.lastWinDisplay = page.locator('.ar-hud-item', { hasText: 'Last Win' });
    this.lobbyButton = page.locator('.ar-lobby-btn');

    this.chips = page.locator('.ar-chip');
    this.selectedChip = page.locator('.ar-chip.is-selected');

    this.table = page.locator('.ar-table');
    this.zeroCell = page.locator('.ar-zero').first();
    this.doubleZeroCell = page.locator('.ar-zero').last();
    this.numberCells = page.locator('.ar-number');
    this.betBadges = page.locator('.ar-bet-badge');

    this.spinButton = page.locator('.ar-spin');
    this.undoButton = page.locator('.ar-actions button', { hasText: /undo/i });
    this.clearButton = page.locator('.ar-actions button', { hasText: /clear/i });
    this.rebetButton = page.locator('.ar-actions button', { hasText: /rebet/i });
    this.doubleButton = page.locator('.ar-actions button', { hasText: /double/i });

    this.resultDisplay = page.locator('.ar-result');
    this.historyItems = page.locator('.ar-history-item');
    this.wheelPanel = page.locator('.ar-wheel-panel');
    this.payoutGuide = page.locator('.ar-payout-guide');
  }

  async goto() {
    await this.page.goto('/slots/american-roulette');
  }

  async selectChip(amount: number) {
    await this.page.getByLabel(`${amount} chip`, { exact: true }).click();
  }

  async betOnNumber(n: number) {
    await this.numberCells.filter({ hasText: new RegExp(`^${n}$`) }).click();
  }

  async betOnZero() {
    await this.zeroCell.click();
  }

  async betOnDoubleZero() {
    await this.doubleZeroCell.click();
  }

  async spin() {
    await this.spinButton.click();
  }
}
