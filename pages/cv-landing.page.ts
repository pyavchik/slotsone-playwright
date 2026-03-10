import type { Locator, Page } from '@playwright/test';

export class CVLandingPage {
  readonly title: Locator;
  readonly avatar: Locator;
  readonly openSlotsButton: Locator;

  // Document links (with data-testid)
  readonly requirementsLink: Locator;
  readonly testCasesLink: Locator;
  readonly sqlLink: Locator;
  readonly testDesignLink: Locator;

  // Document links (without data-testid)
  readonly postmanLink: Locator;
  readonly swaggerLink: Locator;
  readonly bugReportLink: Locator;
  readonly downloadCvLink: Locator;

  // Contact links
  readonly emailLink: Locator;
  readonly phoneLink: Locator;

  constructor(private page: Page) {
    this.title = page.getByTestId('cv-title');
    this.avatar = page.locator('.cv-avatar');
    this.openSlotsButton = page.getByTestId('cv-open-slots').first();

    this.requirementsLink = page.getByTestId('cv-requirements');
    this.testCasesLink = page.getByTestId('cv-test-cases');
    this.sqlLink = page.getByTestId('cv-sql');
    this.testDesignLink = page.getByTestId('cv-test-design');

    this.postmanLink = page.locator('a[href="/postman-tests.html"]');
    this.swaggerLink = page.locator('a[href="/api-docs"]');
    this.bugReportLink = page.locator('a[href="/bug-report.html"]');
    this.downloadCvLink = page.locator('a[href*="CV"]');

    this.emailLink = page.locator('a[href^="mailto:"]');
    this.phoneLink = page.locator('a[href^="tel:"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async navigateToSlots() {
    await this.openSlotsButton.click();
  }
}
