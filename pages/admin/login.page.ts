import type { Locator, Page } from '@playwright/test';

export class AdminLoginPage {
  readonly logo: Locator;
  readonly title: Locator;
  readonly description: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly demoHint: Locator;

  constructor(private page: Page) {
    this.logo = page.locator('text=S1').first();
    this.title = page.getByRole('heading', { name: 'Admin Login' });
    this.description = page.getByText('Sign in to the SlotsOne administration panel');
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: /sign in/i });
    this.errorMessage = page.locator('.bg-destructive\\/10');
    this.demoHint = page.getByText('Demo: admin@slotsone.com / admin123');
  }

  async goto() {
    await this.page.goto('/admin/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
