import type { Locator, Page } from '@playwright/test';

export class AdminKycPage {
  readonly title: Locator;

  // Filters
  readonly statusSelect: Locator;
  readonly docTypeSelect: Locator;

  // Table
  readonly table: Locator;
  readonly tableRows: Locator;

  // Actions
  readonly approveButtons: Locator;
  readonly rejectButtons: Locator;

  // Reject dialog
  readonly rejectDialog: Locator;
  readonly rejectReasonInput: Locator;
  readonly rejectConfirmButton: Locator;
  readonly cancelButton: Locator;

  // Pagination
  readonly prevPageButton: Locator;
  readonly nextPageButton: Locator;

  constructor(private page: Page) {
    this.title = page.getByRole('heading', { name: 'KYC', level: 1 });

    this.statusSelect = page.locator('button[role="combobox"]').first();
    this.docTypeSelect = page.locator('button[role="combobox"]').nth(1);

    this.table = page.locator('table');
    this.tableRows = page.locator('table tbody tr');

    this.approveButtons = page.locator('button:has(svg.lucide-check)');
    this.rejectButtons = page.locator('button:has(svg.lucide-ban)');

    this.rejectDialog = page.locator('[role="dialog"]');
    this.rejectReasonInput = page.locator('[role="dialog"] textarea');
    this.rejectConfirmButton = page.locator('[role="dialog"] button', { hasText: /reject/i });
    this.cancelButton = page.locator('[role="dialog"] button', { hasText: /cancel/i });

    this.prevPageButton = page.getByRole('button', { name: /previous/i });
    this.nextPageButton = page.getByRole('button', { name: /next/i });
  }

  async goto() {
    await this.page.goto('/admin/kyc');
  }
}
