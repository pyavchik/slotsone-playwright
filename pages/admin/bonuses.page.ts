import type { Locator, Page } from '@playwright/test';

export class AdminBonusesPage {
  readonly title: Locator;

  // Tabs
  readonly bonusesTab: Locator;
  readonly promotionsTab: Locator;

  // Filters
  readonly typeSelect: Locator;
  readonly statusSelect: Locator;
  readonly clearButton: Locator;

  // Table
  readonly table: Locator;
  readonly tableRows: Locator;

  // Progress bars
  readonly progressBars: Locator;

  // Pagination
  readonly prevPageButton: Locator;
  readonly nextPageButton: Locator;

  constructor(private page: Page) {
    this.title = page.getByRole('heading', { name: 'Bonuses', level: 1 });

    this.bonusesTab = page.getByRole('tab', { name: /player bonuses/i });
    this.promotionsTab = page.getByRole('tab', { name: /promotions/i });

    this.typeSelect = page.locator('button[role="combobox"]').first();
    this.statusSelect = page.locator('button[role="combobox"]').nth(1);
    this.clearButton = page.getByRole('button', { name: /clear/i });

    this.table = page.locator('table');
    this.tableRows = page.locator('table tbody tr');

    this.progressBars = page.locator('[role="progressbar"]');

    this.prevPageButton = page.getByRole('button', { name: /previous/i });
    this.nextPageButton = page.getByRole('button', { name: /next/i });
  }

  async goto() {
    await this.page.goto('/admin/bonuses');
  }
}
