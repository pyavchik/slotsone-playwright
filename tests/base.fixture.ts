import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
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
