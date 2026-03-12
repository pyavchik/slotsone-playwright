import type { Locator, Page } from '@playwright/test';

export class AdminGamesPage {
  readonly title: Locator;

  // Filters
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly categorySelect: Locator;
  readonly clearButton: Locator;

  // Table
  readonly table: Locator;
  readonly tableRows: Locator;

  // Toggles
  readonly activeToggles: Locator;
  readonly featuredToggles: Locator;

  // Pagination
  readonly prevPageButton: Locator;
  readonly nextPageButton: Locator;

  constructor(private page: Page) {
    this.title = page.getByRole('heading', { name: 'Games', level: 1 });

    this.searchInput = page.getByPlaceholder(/search/i);
    this.searchButton = page.locator('button:has(svg.lucide-search)');
    this.categorySelect = page.locator('button[role="combobox"]').filter({ hasText: /category/i }).first();
    this.clearButton = page.getByRole('button', { name: /clear/i });

    this.table = page.locator('table');
    this.tableRows = page.locator('table tbody tr');

    this.activeToggles = page.locator('button[role="switch"]');
    this.featuredToggles = page.locator('button[role="switch"]');

    this.prevPageButton = page.getByRole('button', { name: /previous/i });
    this.nextPageButton = page.getByRole('button', { name: /next/i });
  }

  async goto() {
    await this.page.goto('/admin/games');
  }
}
