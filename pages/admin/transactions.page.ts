import type { Locator, Page } from '@playwright/test';

export class AdminTransactionsPage {
  readonly title: Locator;

  // Tabs
  readonly allTab: Locator;
  readonly pendingTab: Locator;

  // Filters
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly typeSelect: Locator;
  readonly statusSelect: Locator;
  readonly clearButton: Locator;

  // Table
  readonly table: Locator;
  readonly tableRows: Locator;

  // Actions (pending tab)
  readonly approveButtons: Locator;
  readonly rejectButtons: Locator;

  // Pagination
  readonly prevPageButton: Locator;
  readonly nextPageButton: Locator;

  constructor(private page: Page) {
    this.title = page.getByRole('heading', { name: 'Transactions', level: 1 });

    this.allTab = page.getByRole('tab', { name: /all transactions/i });
    this.pendingTab = page.getByRole('tab', { name: /pending/i });

    this.searchInput = page.getByPlaceholder(/search/i);
    this.searchButton = page.locator('button:has(svg.lucide-search)');
    this.typeSelect = page.locator('button[role="combobox"]').filter({ hasText: /type/i }).first();
    this.statusSelect = page.locator('button[role="combobox"]').filter({ hasText: /status/i }).first();
    this.clearButton = page.getByRole('button', { name: /clear/i });

    this.table = page.locator('table');
    this.tableRows = page.locator('table tbody tr');

    this.approveButtons = page.locator('button:has(svg.lucide-check)');
    this.rejectButtons = page.locator('button:has(svg.lucide-ban)');

    this.prevPageButton = page.getByRole('button', { name: /previous/i });
    this.nextPageButton = page.getByRole('button', { name: /next/i });
  }

  async goto() {
    await this.page.goto('/admin/transactions');
  }
}
