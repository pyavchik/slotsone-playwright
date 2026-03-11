import { test, expect } from '../base.fixture';
import { AdminKycPage } from '../../pages/admin/kyc.page';

test.describe('Admin KYC', () => {
  let kyc: AdminKycPage;

  test.beforeEach(async ({ page }) => {
    kyc = new AdminKycPage(page);
    await kyc.goto();
    await expect(kyc.title).toBeVisible({ timeout: 15_000 });
  });

  test('page renders with title', async () => {
    await expect(kyc.title).toContainText('KYC');
  });

  test('KYC table loads with data', async () => {
    await expect(kyc.table).toBeVisible({ timeout: 15_000 });
    const rowCount = await kyc.tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('status and document type filters are visible', async () => {
    await expect(kyc.statusSelect).toBeVisible();
    await expect(kyc.docTypeSelect).toBeVisible();
  });

  test('pending documents show action buttons', async () => {
    await expect(kyc.table).toBeVisible({ timeout: 15_000 });
    // Approve/reject buttons should appear for pending items
    const approveCount = await kyc.approveButtons.count();
    const rejectCount = await kyc.rejectButtons.count();
    expect(approveCount + rejectCount).toBeGreaterThan(0);
  });
});
