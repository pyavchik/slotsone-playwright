import type { Locator, Page } from '@playwright/test';

export class AdminDashboardPage {
  readonly title: Locator;
  readonly subtitle: Locator;

  // KPI cards
  readonly kpiCards: Locator;
  readonly totalPlayersCard: Locator;
  readonly totalBetsCard: Locator;
  readonly totalWinsCard: Locator;
  readonly ggrCard: Locator;

  // Alert cards
  readonly pendingKycCard: Locator;
  readonly highRiskCard: Locator;

  // Charts
  readonly chartsSection: Locator;

  // Recent transactions
  readonly recentTxTable: Locator;
  readonly recentTxRows: Locator;

  // Sidebar
  readonly sidebar: Locator;
  readonly sidebarLinks: Locator;

  // Topbar
  readonly avatarButton: Locator;

  constructor(private page: Page) {
    this.title = page.getByRole('heading', { name: 'Dashboard', level: 1 });
    this.subtitle = page.getByText('iGaming platform overview');

    this.kpiCards = page.locator('.grid.gap-4 >> nth=0').locator('[class*="rounded-"]').filter({ has: page.locator('.text-sm.font-medium') });
    this.totalPlayersCard = page.getByText('Total Players').locator('..');
    this.totalBetsCard = page.getByText('Total Bets').locator('..');
    this.totalWinsCard = page.getByText('Total Wins').locator('..');
    this.ggrCard = page.getByText('GGR (Gross Gaming Revenue)').locator('..');

    this.pendingKycCard = page.getByText('Pending KYC Reviews').locator('..').locator('..');
    this.highRiskCard = page.getByText('High Risk Players').locator('..').locator('..');

    this.chartsSection = page.locator('canvas').first();

    this.recentTxTable = page.getByText('Recent Large Transactions').locator('..').locator('..').locator('table');
    this.recentTxRows = page.locator('table tbody tr');

    this.sidebar = page.locator('aside');
    this.sidebarLinks = page.locator('aside nav a');
    this.avatarButton = page.locator('header button').last();
  }

  async goto() {
    await this.page.goto('/admin');
  }
}
