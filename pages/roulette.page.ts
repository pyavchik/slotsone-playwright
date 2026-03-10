import type { Locator, Page } from '@playwright/test';

export class RoulettePage {
  // Status bar
  readonly balancePill: Locator;
  readonly winBadge: Locator;
  readonly lobbyButton: Locator;
  readonly muteButton: Locator;

  // Chip rack
  readonly chipButtons: Locator;
  readonly selectedChip: Locator;

  // Betting table
  readonly bettingTable: Locator;
  readonly zeroCell: Locator;
  readonly numberCells: Locator;
  readonly outsideBets: Locator;

  // Controls
  readonly spinButton: Locator;
  readonly resetButton: Locator;
  readonly doubleButton: Locator;
  readonly undoButton: Locator;
  readonly rebetButton: Locator;
  readonly betDisplay: Locator;

  // Recent numbers
  readonly recentNumbers: Locator;

  // Result panel
  readonly resultPanel: Locator;

  // Racetrack (announced bets)
  readonly racetrackTab: Locator;
  readonly voisinsButton: Locator;
  readonly tiersButton: Locator;
  readonly orphelinsButton: Locator;

  // Wheel
  readonly wheelArea: Locator;

  constructor(private page: Page) {
    // Status bar
    this.balancePill = page.locator('.sb-pill--balance');
    this.winBadge = page.locator('.sb-pill--win');
    this.lobbyButton = page.getByLabel('Back to lobby');
    this.muteButton = page.getByLabel(/mute|unmute/i);

    // Chip rack
    this.chipButtons = page.locator('.cr-chip-btn');
    this.selectedChip = page.locator('.cr-chip-btn--selected');

    // Betting table
    this.bettingTable = page.getByLabel('Roulette betting table');
    this.zeroCell = page.getByLabel('Bet on 0');
    this.numberCells = page.locator('.bt-number');
    this.outsideBets = page.locator('.bt-outside');

    // Controls
    this.spinButton = page.getByLabel(/^spin$/i);
    this.resetButton = page.getByLabel('Clear all bets').first();
    this.doubleButton = page.getByLabel('Double all bets').first();
    this.undoButton = page.getByLabel('Undo last bet').first();
    this.rebetButton = page.getByLabel('Rebet previous bets').first();
    this.betDisplay = page.locator('.ct-bet-display');

    // Recent numbers
    this.recentNumbers = page.locator('.rn-circle');

    // Result panel
    this.resultPanel = page.locator('.rs-panel');

    // Racetrack
    this.racetrackTab = page.locator('.rp-tab', { hasText: /racetrack/i });
    this.voisinsButton = page.getByLabel(/voisins/i);
    this.tiersButton = page.getByLabel(/tiers/i);
    this.orphelinsButton = page.getByLabel(/orphelins/i);

    // Wheel
    this.wheelArea = page.locator('.rp-wheel-area');
  }

  async goto() {
    await this.page.goto('/slots/european-roulette');
  }

  async selectChip(amount: number) {
    await this.page.getByAltText(`$${amount} chip`).click();
  }

  async betOnNumber(n: number) {
    const color = n === 0 ? '' : '';
    await this.page.getByLabel(new RegExp(`Bet on ${n}\\b`)).click();
  }

  async betOnZero() {
    await this.zeroCell.click();
  }

  async betOnOutside(label: string) {
    await this.page.getByLabel(new RegExp(`Bet on ${label}`, 'i')).click();
  }

  async spin() {
    await this.spinButton.click();
  }
}
