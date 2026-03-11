import { test, expect } from '../base.fixture';
import { AdminLoginPage } from '../../pages/admin/login.page';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

test.describe('Admin Login @allure.label.parentSuite:Admin_Panel @allure.label.suite:Login', () => {
  let login: AdminLoginPage;

  test.beforeEach(async ({ page }) => {
    login = new AdminLoginPage(page);
    await login.goto();
  });

  test('login form renders with all elements', async () => {
    await expect(login.logo).toBeVisible();
    await expect(login.title).toBeVisible();
    await expect(login.description).toBeVisible();
    await expect(login.emailInput).toBeVisible();
    await expect(login.passwordInput).toBeVisible();
    await expect(login.submitButton).toBeVisible();
  });

  test('invalid credentials show error message', async () => {
    await login.login('wrong@example.com', 'wrongpassword');
    await expect(login.errorMessage).toBeVisible({ timeout: 10_000 });
  });

  test('successful login redirects to dashboard', async ({ page }) => {
    await login.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    await expect(page).toHaveURL(/\/admin$/, { timeout: 15_000 });
  });

  test('sign out redirects to login page', async ({ page }) => {
    await login.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    await expect(page).toHaveURL(/\/admin$/, { timeout: 15_000 });

    // Open user menu and sign out
    await page.locator('header button').last().click();
    await page.getByText('Sign out').click();
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 15_000 });
  });
});
