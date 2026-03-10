import type { Locator, Page } from '@playwright/test';

export class AdminRiskPage {
  readonly title: Locator;

  // Tabs
  readonly flaggedTab: Locator;
  readonly amlTab: Locator;
  readonly duplicatesTab: Locator;

  // Table
  readonly table: Locator;
  readonly tableRows: Locator;

  // Pagination
  readonly prevPageButton: Locator;
  readonly nextPageButton: Locator;

  constructor(private page: Page) {
    this.title = page.getByRole('heading', { name: /risk/i, level: 1 });

    this.flaggedTab = page.getByRole('tab', { name: /flagged/i });
    this.amlTab = page.getByRole('tab', { name: /aml/i });
    this.duplicatesTab = page.getByRole('tab', { name: /duplicate/i });

    this.table = page.locator('table');
    this.tableRows = page.locator('table tbody tr');

    this.prevPageButton = page.getByRole('button', { name: /previous/i });
    this.nextPageButton = page.getByRole('button', { name: /next/i });
  }

  async goto() {
    await this.page.goto('/admin/risk');
  }
}
