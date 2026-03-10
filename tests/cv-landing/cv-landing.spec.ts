import { test, expect } from '@playwright/test';
import { CVLandingPage } from '../../pages/cv-landing.page';

test.describe('CV Landing Page', () => {
  let cv: CVLandingPage;

  test.beforeEach(async ({ page }) => {
    cv = new CVLandingPage(page);
    await cv.goto();
  });

  test('renders title and avatar', async () => {
    await expect(cv.title).toBeVisible();
    await expect(cv.avatar).toBeVisible();
  });

  test('slots button navigates to /slots', async ({ page, context }) => {
    await context.route('**/api/v1/auth/refresh', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ access_token: 'e2e_mock', expires_in: 3600 }),
      }),
    );

    await cv.navigateToSlots();
    await expect(page).toHaveURL(/\/slots/);
  });

  // ── Document links ──────────────────────────────────────────────────

  const testIdLinks = [
    { name: 'requirements', testId: 'cv-requirements', href: '/requirements.html' },
    { name: 'test cases', testId: 'cv-test-cases', href: '/test-cases.html' },
    { name: 'sql', testId: 'cv-sql', href: '/sql.html' },
    { name: 'test design', testId: 'cv-test-design', href: '/test-design.html' },
  ] as const;

  for (const { name, testId, href } of testIdLinks) {
    test(`${name} link points to ${href}`, async ({ page }) => {
      const link = page.getByTestId(testId);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', href);
    });
  }

  test('postman link points to /postman-tests.html', async () => {
    await expect(cv.postmanLink).toBeVisible();
  });

  test('swagger link points to /api-docs', async () => {
    await expect(cv.swaggerLink).toBeVisible();
  });

  test('bug report link points to /bug-report.html', async () => {
    await expect(cv.bugReportLink).toBeVisible();
  });

  test('download CV link is present', async () => {
    await expect(cv.downloadCvLink).toBeVisible();
  });

  // ── Contact links ───────────────────────────────────────────────────

  test('email contact link is present', async () => {
    await expect(cv.emailLink).toBeVisible();
    await expect(cv.emailLink).toHaveAttribute('href', /mailto:/);
  });

  test('phone contact link is present', async () => {
    await expect(cv.phoneLink).toBeVisible();
    await expect(cv.phoneLink).toHaveAttribute('href', /tel:/);
  });
});
