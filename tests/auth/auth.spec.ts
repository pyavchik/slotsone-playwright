import { test, expect } from '@playwright/test';
import { AuthPage } from '../../pages/auth.page';
import {
  mockAuth,
  mockAuthFailure,
  mockLogin,
  mockLoginError,
  mockRegister,
} from '../../fixtures/helpers';

test.describe('Authentication', () => {
  // ── Login ───────────────────────────────────────────────────────────

  test('login page renders form', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.gotoLogin();

    await expect(auth.emailInput).toBeVisible();
    await expect(auth.passwordInput).toBeVisible();
    await expect(auth.submitButton).toBeVisible();
  });

  test('successful login redirects to lobby', async ({ page, context }) => {
    await mockAuthFailure(context);

    const auth = new AuthPage(page);
    await auth.gotoLogin();

    await context.unrouteAll();
    await mockLogin(context);
    await mockAuth(context);

    await auth.login('test@example.com', 'Password123');
    await expect(page).toHaveURL(/\/slots/);
  });

  test('login with invalid credentials shows error', async ({ page, context }) => {
    await mockAuthFailure(context);
    await mockLoginError(context);

    const auth = new AuthPage(page);
    await auth.gotoLogin();
    await auth.login('wrong@example.com', 'badpassword');

    await expect(auth.errorAlert).toBeVisible();
  });

  // ── Registration ────────────────────────────────────────────────────

  test('register page renders form with age checkbox', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.gotoRegister();

    await expect(auth.emailInput).toBeVisible();
    await expect(auth.passwordInput).toBeVisible();
    await expect(auth.ageCheckbox).toBeVisible();
    await expect(auth.submitButton).toBeVisible();
  });

  test('successful registration redirects to lobby', async ({ page, context }) => {
    await mockAuthFailure(context);

    const auth = new AuthPage(page);
    await auth.gotoRegister();

    await context.unrouteAll();
    await mockRegister(context);
    await mockAuth(context);

    await auth.register('newuser@example.com', 'Password123');
    await expect(page).toHaveURL(/\/slots/);
  });

  // ── Auth tabs ───────────────────────────────────────────────────────

  test('can switch between login and register tabs', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.gotoLogin();

    // Age checkbox should NOT be visible on login form
    await expect(auth.ageCheckbox).not.toBeVisible();

    // Switch to register tab
    await auth.registerTab.click();
    await expect(auth.ageCheckbox).toBeVisible();

    // Switch back to login tab
    await auth.loginTab.click();
    await expect(auth.ageCheckbox).not.toBeVisible();
  });

  // ── Protected route ─────────────────────────────────────────────────

  test('protected route redirects unauthenticated user to login', async ({
    page,
    context,
  }) => {
    await mockAuthFailure(context);
    await page.goto('/slots');
    await expect(page).toHaveURL(/\/login/);
  });
});
