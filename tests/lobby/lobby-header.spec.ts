import { test, expect } from '../base.fixture';
import { LobbyPage } from '../../pages/lobby.page';
import { mockAuth, mockImages, mockLogout } from '../../fixtures/helpers';

test.describe('Lobby Header & User Menu @allure.label.parentSuite:Lobby @allure.label.suite:Header', () => {
  let lobby: LobbyPage;

  test.beforeEach(async ({ page, context }) => {
    await mockAuth(context);
    await mockImages(context);
    lobby = new LobbyPage(page);
    await lobby.goto();
    await expect(lobby.gameCards.first()).toBeVisible();
  });

  // ── Balance ───────────────────────────────────────────────────────────

  test('balance is displayed in header', async () => {
    await expect(lobby.balancePill).toBeVisible();
    await expect(lobby.balanceValue).toBeVisible();
    await expect(lobby.balanceValue).toContainText('USD');
  });

  // ── Deposit button ────────────────────────────────────────────────────

  test('deposit button is visible but disabled', async () => {
    await expect(lobby.depositButton).toBeVisible();
    await expect(lobby.depositButton).toBeDisabled();
  });

  // ── User menu ─────────────────────────────────────────────────────────

  test('user menu button is visible', async () => {
    await expect(lobby.userButton).toBeVisible();
  });

  test('user menu opens with profile and logout options', async () => {
    await lobby.openUserMenu();

    await expect(lobby.userMenuProfile).toBeVisible();
    await expect(lobby.userMenuLogout).toBeVisible();
  });

  test('logout from user menu redirects to login', async ({ page, context }) => {
    await mockLogout(context);

    // Before clicking logout, ensure auth refresh will fail so redirect sticks
    await context.unrouteAll();
    await mockLogout(context);
    await context.route('**/api/v1/auth/refresh', (route) =>
      route.fulfill({ status: 401, body: '{"error":"logged_out"}' }),
    );

    await lobby.openUserMenu();
    await lobby.userMenuLogout.click();

    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });
});
