import type { Locator, Page } from '@playwright/test';

export class AuthPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly ageCheckbox: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  readonly loginTab: Locator;
  readonly registerTab: Locator;

  constructor(private page: Page) {
    this.emailInput = page.locator('#auth-email');
    this.passwordInput = page.locator('#auth-password');
    this.ageCheckbox = page.locator('#auth-age');
    this.submitButton = page.locator('.auth-submit');
    this.errorAlert = page.locator('.auth-error');
    this.loginTab = page.locator('.auth-tab', { hasText: /log\s*in/i });
    this.registerTab = page.locator('.auth-tab', { hasText: /register/i });
  }

  async gotoLogin() {
    await this.page.goto('/login');
  }

  async gotoRegister() {
    await this.page.goto('/register');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async register(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.ageCheckbox.check();
    await this.submitButton.click();
  }
}
