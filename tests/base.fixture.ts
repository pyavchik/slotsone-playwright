import { test as base } from '@playwright/test';
import * as path from 'path';
import * as allure from 'allure-js-commons';

const EPICS: Record<string, string> = {
  admin: 'Admin Panel',
  auth: 'Auth',
  'cv-landing': 'CV Landing',
  lobby: 'Lobby',
  'slots-game': 'Slots Game',
  history: 'History',
  roulette: 'Roulette',
};

const FEATURES: Record<string, string> = {
  'dashboard.spec.ts': 'Dashboard',
  'login.spec.ts': 'Login',
  'navigation.spec.ts': 'Navigation',
  'players.spec.ts': 'Players',
  'player-detail.spec.ts': 'Player Detail',
  'transactions.spec.ts': 'Transactions',
  'games.spec.ts': 'Games',
  'kyc.spec.ts': 'KYC',
  'bonuses.spec.ts': 'Bonuses',
  'risk.spec.ts': 'Risk',
  'reports.spec.ts': 'Reports',
  'settings.spec.ts': 'Settings',
  'auth.spec.ts': 'Login & Register',
  'cv-landing.spec.ts': 'Landing Page',
  'lobby.spec.ts': 'Game Cards',
  'lobby-filters.spec.ts': 'Filters',
  'lobby-header.spec.ts': 'Header',
  'slots-game.spec.ts': 'Gameplay',
  'paytable.spec.ts': 'Paytable',
  'keyboard.spec.ts': 'Keyboard',
  'error-handling.spec.ts': 'Error Handling',
  'win-overlay.spec.ts': 'Win Overlay',
  'history.spec.ts': 'Game History',
  'round-detail.spec.ts': 'Round Detail',
  'european-roulette.spec.ts': 'European Roulette',
  'american-roulette.spec.ts': 'American Roulette',
};

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    // Auto-label for Allure Behaviors tab
    const relPath = path.relative(
      path.join(__dirname),
      testInfo.file,
    );
    const dir = relPath.split(path.sep)[0];
    const file = path.basename(testInfo.file);

    if (EPICS[dir]) {
      await allure.parentSuite(EPICS[dir]);
    }
    if (FEATURES[file]) {
      await allure.suite(FEATURES[file]);
    }

    await use(page);

    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ timeout: 3000 }).catch(() => null);
      if (screenshot) {
        await testInfo.attach('screenshot', {
          body: screenshot,
          contentType: 'image/png',
        });
      }
    }
  },
});

export { expect } from '@playwright/test';
