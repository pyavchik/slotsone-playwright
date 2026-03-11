import { test, expect } from '../base.fixture';
import { RoundDetailPage } from '../../pages/round-detail.page';
import { mockAuth, mockImages, mockRoundDetail } from '../../fixtures/helpers';

test.describe('Round Detail', () => {
  let detail: RoundDetailPage;

  test.beforeEach(async ({ page, context }) => {
    await mockAuth(context);
    await mockRoundDetail(context);
    await mockImages(context);
    detail = new RoundDetailPage(page);
    await detail.goto('spin_hist_1');
    await expect(detail.reelGrid).toBeVisible({ timeout: 10_000 });
  });

  // ── Rendering ───────────────────────────────────────────────────────

  test('round detail page loads with reel grid', async () => {
    await expect(detail.reelGrid).toBeVisible();
    await expect(detail.title).toBeVisible();
    await expect(detail.timestamp).toBeVisible();
  });

  test('reel grid shows 15 cells (5x3)', async () => {
    await expect(detail.reelCells).toHaveCount(15);
  });

  test('winning cells are highlighted', async () => {
    const winCount = await detail.winCells.count();
    expect(winCount).toBeGreaterThan(0);
  });

  // ── Win breakdown ─────────────────────────────────────────────────

  test('win breakdown shows winning lines', async () => {
    await expect(detail.breakdownItems.first()).toBeVisible();
    await expect(detail.breakdownItems.first()).toContainText('A');
  });

  // ── Financial summary ─────────────────────────────────────────────

  test('financial summary is displayed', async () => {
    await expect(detail.financeGrid).toBeVisible();
    const itemCount = await detail.financeItems.count();
    expect(itemCount).toBeGreaterThanOrEqual(4); // Balance Before, Bet, Win, Net, etc.
  });

  // ── Transaction log ───────────────────────────────────────────────

  test('transaction log shows bet and win', async () => {
    await expect(detail.txnItems.first()).toBeVisible();
    const txnCount = await detail.txnItems.count();
    expect(txnCount).toBe(2); // bet + win
  });

  // ── Provably fair ─────────────────────────────────────────────────

  test('provably fair section is togglable', async () => {
    await expect(detail.pfToggle).toBeVisible();

    await detail.toggleProvablyFair();
    await expect(detail.pfRows.first()).toBeVisible();
  });

  test('provably fair shows seed data', async () => {
    await detail.toggleProvablyFair();

    const rowCount = await detail.pfRows.count();
    expect(rowCount).toBeGreaterThanOrEqual(3); // hash, seed, client_seed, nonce
  });

  test('verify button triggers verification', async () => {
    await detail.toggleProvablyFair();
    await detail.verify();

    await expect(detail.pfResult).toBeVisible({ timeout: 5_000 });
  });

  // ── Navigation ────────────────────────────────────────────────────

  test('back button navigates to history', async ({ page, context }) => {
    // Mock history endpoint for navigation
    await context.route('**/api/v1/history*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [],
          total: 0,
          summary: { total_rounds: 0, total_wagered: 0, total_won: 0, net_result: 0, biggest_win: 0 },
        }),
      }),
    );

    await detail.goBack();
    await expect(page).toHaveURL(/\/history/);
  });
});
