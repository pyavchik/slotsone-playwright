import type { Locator, Page } from '@playwright/test';

export class AdminReportsPage {
  readonly title: Locator;

  // Period selector
  readonly periodSelect: Locator;

  // Tabs
  readonly financialTab: Locator;
  readonly playersTab: Locator;
  readonly gamesTab: Locator;

  // Financial tab
  readonly summaryCards: Locator;
  readonly breakdownTable: Locator;
  readonly exportButton: Locator;

  // Players tab
  readonly registrationTable: Locator;
  readonly statusBreakdown: Locator;

  // Games tab
  readonly gamesTable: Locator;

  constructor(private page: Page) {
    this.title = page.getByRole('heading', { name: 'Reports', level: 1 });

    this.periodSelect = page.locator('button[role="combobox"]').first();

    this.financialTab = page.getByRole('tab', { name: /financial/i });
    this.playersTab = page.getByRole('tab', { name: /players/i });
    this.gamesTab = page.getByRole('tab', { name: /games/i });

    this.summaryCards = page.locator('.grid .font-mono');
    this.breakdownTable = page.locator('table');
    this.exportButton = page.getByRole('button', { name: /export/i });

    this.registrationTable = page.locator('table');
    this.statusBreakdown = page.getByText(/status breakdown/i).locator('..');

    this.gamesTable = page.locator('table');
  }

  async goto() {
    await this.page.goto('/admin/reports');
  }
}
