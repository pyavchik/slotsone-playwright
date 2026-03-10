import { test, expect } from '@playwright/test';
import { AdminSettingsPage } from '../../pages/admin/settings.page';

test.describe('Admin Settings', () => {
  let settings: AdminSettingsPage;

  test.beforeEach(async ({ page }) => {
    settings = new AdminSettingsPage(page);
    await settings.goto();
    await expect(settings.title).toBeVisible({ timeout: 15_000 });
  });

  test('page renders with title', async () => {
    await expect(settings.title).toHaveText('Settings');
  });

  test('admin users table is visible', async () => {
    await expect(settings.adminUsersTab).toBeVisible();
    await expect(settings.adminTable).toBeVisible({ timeout: 15_000 });
    const rowCount = await settings.adminRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('add admin button opens dialog', async () => {
    await settings.addAdminButton.click();
    await expect(settings.dialog).toBeVisible();
    await expect(settings.nameInput).toBeVisible();
    await expect(settings.emailInput).toBeVisible();
    await expect(settings.passwordInput).toBeVisible();
  });

  test('add admin dialog can be cancelled', async () => {
    await settings.addAdminButton.click();
    await expect(settings.dialog).toBeVisible();
    await settings.dialogCancelButton.click();
    await expect(settings.dialog).not.toBeVisible();
  });

  test('audit log tab shows data', async () => {
    await settings.auditLogTab.click();
    await expect(settings.auditTable).toBeVisible({ timeout: 10_000 });
  });

  test('system tab shows info cards', async () => {
    await settings.systemTab.click();
    await expect(settings.systemInfoCard).toBeVisible({ timeout: 10_000 });
    await expect(settings.configCard).toBeVisible();
  });
});
