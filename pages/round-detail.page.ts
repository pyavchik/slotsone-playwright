import type { Locator, Page } from '@playwright/test';

export class RoundDetailPage {
  // Header
  readonly backButton: Locator;
  readonly title: Locator;
  readonly timestamp: Locator;

  // Reel result
  readonly reelGrid: Locator;
  readonly reelCells: Locator;
  readonly winCells: Locator;

  // Win breakdown
  readonly breakdownItems: Locator;

  // Financial summary
  readonly financeGrid: Locator;
  readonly financeItems: Locator;

  // Transaction log
  readonly txnList: Locator;
  readonly txnItems: Locator;

  // Provably fair
  readonly pfToggle: Locator;
  readonly pfRows: Locator;
  readonly pfVerifyButton: Locator;
  readonly pfResult: Locator;

  // States
  readonly loading: Locator;
  readonly error: Locator;

  constructor(private page: Page) {
    this.backButton = page.locator('.rd-back-btn');
    this.title = page.locator('.rd-title');
    this.timestamp = page.locator('.rd-timestamp');

    this.reelGrid = page.locator('.rd-reel-grid');
    this.reelCells = page.locator('.rd-reel-cell');
    this.winCells = page.locator('.rd-reel-cell--win');

    this.breakdownItems = page.locator('.rd-breakdown-item');

    this.financeGrid = page.locator('.rd-finance-grid');
    this.financeItems = page.locator('.rd-finance-item');

    this.txnList = page.locator('.rd-txn-list');
    this.txnItems = page.locator('.rd-txn-item');

    this.pfToggle = page.locator('.rd-pf-toggle');
    this.pfRows = page.locator('.rd-pf-row');
    this.pfVerifyButton = page.locator('.rd-pf-verify-btn');
    this.pfResult = page.locator('.rd-pf-result');

    this.loading = page.locator('.rd-loading');
    this.error = page.locator('.rd-error');
  }

  async goto(roundId: string) {
    await this.page.goto(`/round/${roundId}`);
  }

  async toggleProvablyFair() {
    await this.pfToggle.click();
  }

  async verify() {
    await this.pfVerifyButton.click();
  }

  async goBack() {
    await this.backButton.click();
  }
}
