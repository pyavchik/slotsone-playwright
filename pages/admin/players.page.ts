import type { Locator, Page } from '@playwright/test';

export class AdminPlayersPage {
  readonly title: Locator;
  readonly exportButton: Locator;

  // Filters
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly statusSelect: Locator;
  readonly riskSelect: Locator;
  readonly kycSelect: Locator;
  readonly clearButton: Locator;

  // Table
  readonly table: Locator;
  readonly tableRows: Locator;
  readonly loadingText: Locator;

  // Pagination
  readonly prevPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly pageInfo: Locator;

  constructor(private page: Page) {
    this.title = page.getByRole('heading', { name: 'Players', level: 1 });
    this.exportButton = page.getByRole('button', { name: /export csv/i });

    this.searchInput = page.getByPlaceholder(/search by name/i);
    this.searchButton = page.locator('button:has(svg.lucide-search)');
    this.statusSelect = page.locator('button[role="combobox"]').filter({ hasText: /status/i }).first();
    this.riskSelect = page.locator('button[role="combobox"]').filter({ hasText: /risk/i }).first();
    this.kycSelect = page.locator('button[role="combobox"]').filter({ hasText: /kyc/i }).first();
    this.clearButton = page.getByRole('button', { name: /clear/i });

    this.table = page.locator('table');
    this.tableRows = page.locator('table tbody tr');
    this.loadingText = page.getByText('Loading players...');

    this.prevPageButton = page.getByRole('button', { name: /previous/i });
    this.nextPageButton = page.getByRole('button', { name: /next/i });
    this.pageInfo = page.getByText(/page \d+ of \d+/i);
  }

  async goto() {
    await this.page.goto('/admin/players');
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async clickFirstRow() {
    await this.tableRows.first().locator('.cursor-pointer').first().click();
  }
}
