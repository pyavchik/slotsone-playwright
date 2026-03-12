import type { Locator, Page } from '@playwright/test';

export class AdminSettingsPage {
  readonly title: Locator;

  // Tabs
  readonly adminUsersTab: Locator;
  readonly auditLogTab: Locator;
  readonly systemTab: Locator;

  // Admin users
  readonly addAdminButton: Locator;
  readonly adminTable: Locator;
  readonly adminRows: Locator;

  // Add admin dialog
  readonly dialog: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly roleSelect: Locator;
  readonly createButton: Locator;
  readonly dialogCancelButton: Locator;

  // Audit log
  readonly auditTable: Locator;
  readonly auditRows: Locator;

  // System info
  readonly systemInfoCard: Locator;
  readonly configCard: Locator;

  constructor(private page: Page) {
    this.title = page.getByRole('heading', { name: 'Settings', level: 1 });

    this.adminUsersTab = page.getByRole('tab', { name: /admin users/i });
    this.auditLogTab = page.getByRole('tab', { name: /audit/i });
    this.systemTab = page.getByRole('tab', { name: /system/i });

    this.addAdminButton = page.getByRole('button', { name: /add admin/i });
    this.adminTable = page.locator('table');
    this.adminRows = page.locator('table tbody tr');

    this.dialog = page.locator('[role="dialog"]');
    this.nameInput = page.locator('[role="dialog"]').getByPlaceholder('Full name');
    this.emailInput = page.locator('[role="dialog"]').getByPlaceholder('admin@slotsone.com');
    this.passwordInput = page.locator('[role="dialog"]').getByPlaceholder('Minimum 8 characters');
    this.roleSelect = page.locator('[role="dialog"] button[role="combobox"]');
    this.createButton = page.locator('[role="dialog"]').getByRole('button', { name: /create/i });
    this.dialogCancelButton = page.locator('[role="dialog"]').getByRole('button', { name: /cancel/i });

    this.auditTable = page.locator('table');
    this.auditRows = page.locator('table tbody tr');

    this.systemInfoCard = page.getByText(/system information/i).locator('..');
    this.configCard = page.getByText(/configuration/i).locator('..');
  }

  async goto() {
    await this.page.goto('/admin/settings');
  }
}
