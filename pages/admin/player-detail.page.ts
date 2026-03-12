import type { Locator, Page } from '@playwright/test';

export class AdminPlayerDetailPage {
  readonly backButton: Locator;
  readonly username: Locator;
  readonly badges: Locator;

  // Stat cards
  readonly statCards: Locator;

  // Top-up
  readonly topUpButton: Locator;
  readonly topUpInput: Locator;
  readonly creditButton: Locator;
  readonly topUpSuccess: Locator;

  // Tabs
  readonly tabsList: Locator;
  readonly overviewTab: Locator;
  readonly transactionsTab: Locator;
  readonly gameHistoryTab: Locator;
  readonly bonusesTab: Locator;
  readonly kycTab: Locator;
  readonly notesTab: Locator;
  readonly riskTab: Locator;
  readonly auditTab: Locator;

  // Table inside tabs
  readonly tabTable: Locator;

  constructor(private page: Page) {
    this.backButton = page.locator('button:has(svg.lucide-arrow-left)');
    this.username = page.locator('h1');
    this.badges = page.locator('[class*="inline-flex"][class*="rounded"]');

    this.statCards = page.locator('.grid .text-2xl.font-bold');

    this.topUpButton = page.getByRole('button', { name: /top up/i });
    this.topUpInput = page.getByPlaceholder(/amount/i);
    this.creditButton = page.getByRole('button', { name: /credit/i });
    this.topUpSuccess = page.getByText(/credited/i);

    this.tabsList = page.locator('[role="tablist"]');
    this.overviewTab = page.getByRole('tab', { name: /overview/i });
    this.transactionsTab = page.getByRole('tab', { name: /transactions/i });
    this.gameHistoryTab = page.getByRole('tab', { name: /game history/i });
    this.bonusesTab = page.getByRole('tab', { name: /bonuses/i });
    this.kycTab = page.getByRole('tab', { name: /kyc/i });
    this.notesTab = page.getByRole('tab', { name: /notes/i });
    this.riskTab = page.getByRole('tab', { name: /risk/i });
    this.auditTab = page.getByRole('tab', { name: /audit/i });

    this.tabTable = page.locator('table');
  }

  async goto(id: string) {
    await this.page.goto(`/admin/players/${id}`);
  }
}
