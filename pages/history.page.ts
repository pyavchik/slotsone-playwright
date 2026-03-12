import type { Locator, Page } from '@playwright/test';

export class HistoryPage {
  // Header
  readonly backButton: Locator;
  readonly title: Locator;

  // Summary cards
  readonly summaryCards: Locator;
  readonly totalRounds: Locator;
  readonly totalWagered: Locator;
  readonly totalWon: Locator;
  readonly netResult: Locator;
  readonly biggestWin: Locator;

  // Filters
  readonly filtersToggle: Locator;
  readonly filtersSection: Locator;
  readonly dateFrom: Locator;
  readonly dateTo: Locator;
  readonly resultFilter: Locator;
  readonly minBet: Locator;
  readonly maxBet: Locator;
  readonly applyButton: Locator;
  readonly clearButton: Locator;

  // Table
  readonly table: Locator;
  readonly tableRows: Locator;
  readonly detailLinks: Locator;

  // Pagination
  readonly pagination: Locator;
  readonly prevButton: Locator;
  readonly nextButton: Locator;
  readonly pageInfo: Locator;

  // States
  readonly emptyState: Locator;
  readonly loading: Locator;
  readonly error: Locator;

  constructor(private page: Page) {
    this.backButton = page.locator('.gh-back-btn');
    this.title = page.locator('.gh-title');

    this.summaryCards = page.locator('.gh-summary-card');
    this.totalRounds = page.locator('.gh-summary-card', { hasText: 'Total Rounds' }).locator('.gh-summary-value');
    this.totalWagered = page.locator('.gh-summary-card', { hasText: 'Total Wagered' }).locator('.gh-summary-value');
    this.totalWon = page.locator('.gh-summary-card', { hasText: 'Total Won' }).locator('.gh-summary-value');
    this.netResult = page.locator('.gh-summary-card', { hasText: 'Net Result' }).locator('.gh-summary-value');
    this.biggestWin = page.locator('.gh-summary-card', { hasText: 'Biggest Win' }).locator('.gh-summary-value');

    this.filtersToggle = page.locator('.gh-filters-toggle');
    this.filtersSection = page.locator('.gh-filters');
    this.dateFrom = page.locator('.gh-filter-input[type="date"]').first();
    this.dateTo = page.locator('.gh-filter-input[type="date"]').last();
    this.resultFilter = page.locator('.gh-filter-select');
    this.minBet = page.locator('.gh-filter-input[type="number"]').first();
    this.maxBet = page.locator('.gh-filter-input[type="number"]').last();
    this.applyButton = page.locator('.gh-filter-apply');
    this.clearButton = page.locator('.gh-filter-clear');

    this.table = page.locator('.gh-table');
    this.tableRows = page.locator('.gh-table tbody tr');
    this.detailLinks = page.locator('.gh-detail-link');

    this.pagination = page.locator('.gh-pagination');
    this.prevButton = page.locator('.gh-page-btn').first();
    this.nextButton = page.locator('.gh-page-btn').last();
    this.pageInfo = page.locator('.gh-page-info');

    this.emptyState = page.locator('.gh-empty');
    this.loading = page.locator('.gh-loading');
    this.error = page.locator('.gh-error');
  }

  async goto() {
    await this.page.goto('/history');
  }

  async toggleFilters() {
    await this.filtersToggle.click();
  }

  async applyFilters() {
    await this.applyButton.click();
  }

  async clearFilters() {
    await this.clearButton.click();
  }

  async goToPage(direction: 'next' | 'prev') {
    if (direction === 'next') await this.nextButton.click();
    else await this.prevButton.click();
  }

  async openRound(index: number) {
    await this.detailLinks.nth(index).click();
  }
}
