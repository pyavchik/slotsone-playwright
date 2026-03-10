import type { Locator, Page } from '@playwright/test';

export class LobbyPage {
  readonly brand: Locator;
  readonly gameCards: Locator;
  readonly gameCardTitles: Locator;
  readonly categoryTabs: Locator;

  constructor(private page: Page) {
    this.brand = page.locator('.lobby-brand');
    this.gameCards = page.locator('.game-card');
    this.gameCardTitles = page.locator('.game-card-title');
    this.categoryTabs = page.locator('.lobby-nav-tab');
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
}
