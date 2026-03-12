import type { Locator, Page } from '@playwright/test';

export class LobbyPage {
  readonly brand: Locator;
  readonly gameCards: Locator;
  readonly gameCardTitles: Locator;
  readonly categoryTabs: Locator;

  // Header
  readonly balancePill: Locator;
  readonly balanceValue: Locator;
  readonly depositButton: Locator;
  readonly userButton: Locator;
  readonly userMenuProfile: Locator;
  readonly userMenuLogout: Locator;

  // Filters
  readonly searchInput: Locator;
  readonly searchClear: Locator;
  readonly providerSelect: Locator;
  readonly volatilitySelect: Locator;
  readonly sortSelect: Locator;
  readonly clearAllButton: Locator;
  readonly emptyGrid: Locator;

  constructor(private page: Page) {
    this.brand = page.locator('.lobby-brand');
    this.gameCards = page.locator('.game-card');
    this.gameCardTitles = page.locator('.game-card-title');
    this.categoryTabs = page.locator('.lobby-nav-tab');

    // Header
    this.balancePill = page.locator('.lobby-balance-pill');
    this.balanceValue = page.locator('.lobby-balance-value');
    this.depositButton = page.locator('.lobby-deposit-btn');
    this.userButton = page.locator('.lobby-user-btn');
    this.userMenuProfile = page.locator('text=Profile');
    this.userMenuLogout = page.locator('text=Logout');

    // Filters
    this.searchInput = page.locator('.filters-search-input');
    this.searchClear = page.locator('.filters-search-clear');
    this.providerSelect = page.getByRole('combobox', { name: 'Filter by provider' });
    this.volatilitySelect = page.getByRole('combobox', { name: 'Filter by volatility' });
    this.sortSelect = page.getByRole('combobox', { name: 'Sort games' });
    this.clearAllButton = page.locator('.filters-clear-all');
    this.emptyGrid = page.locator('.game-grid-empty');
  }

  async goto() {
    await this.page.goto('/slots');
  }

  categoryTab(name: string): Locator {
    return this.page.locator('.lobby-nav-tab', { hasText: new RegExp(name, 'i') });
  }

  activeTab(): Locator {
    return this.page.locator('.lobby-nav-tab--active');
  }

  async switchCategory(name: string) {
    await this.categoryTab(name).click();
  }

  gameCardByTitle(title: string): Locator {
    return this.page.locator('.game-card-title', { hasText: title });
  }

  async clickGame(title: string) {
    await this.gameCardByTitle(title).click();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async selectProvider(provider: string) {
    await this.providerSelect.selectOption({ label: provider });
  }

  async selectVolatility(volatility: string) {
    await this.volatilitySelect.selectOption({ label: volatility });
  }

  async selectSort(sort: string) {
    await this.sortSelect.selectOption({ label: sort });
  }

  async openUserMenu() {
    await this.userButton.click();
  }
}
