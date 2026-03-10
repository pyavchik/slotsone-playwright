/** Route-interception helpers for API mocking in tests. */

import type { BrowserContext } from '@playwright/test';
import {
  makeAuthTokenResponse,
  makeGameInitResponse,
  makeSpinResponse,
} from './mock-data';

// ── Auth ───────────────────────────────────────────────────────────────

/** Mock /auth/refresh to return a valid token (makes protected routes accessible). */
export async function mockAuth(context: BrowserContext) {
  await context.route('**/api/v1/auth/refresh', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(makeAuthTokenResponse()),
    }),
  );
}

/** Mock /auth/refresh to return 401 (simulates unauthenticated state). */
export async function mockAuthFailure(context: BrowserContext) {
  await context.route('**/api/v1/auth/refresh', (route) =>
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'unauthorized' }),
    }),
  );
}

/** Mock /auth/login to succeed. */
export async function mockLogin(context: BrowserContext) {
  await context.route('**/api/v1/auth/login', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(makeAuthTokenResponse()),
    }),
  );
}

// ── Game ───────────────────────────────────────────────────────────────

/** Mock /game/init to return a valid session. */
export async function mockGameInit(
  context: BrowserContext,
  overrides?: Record<string, unknown>,
) {
  await context.route('**/api/v1/game/init', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(makeGameInitResponse(overrides)),
    }),
  );
}

/** Mock /spin to return a winning spin result. Auto-increments spin_id. */
export async function mockSpin(
  context: BrowserContext,
  overrides?: Record<string, unknown>,
) {
  let count = 0;
  await context.route('**/api/v1/spin', (route) => {
    count++;
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ...makeSpinResponse(overrides),
        spin_id: `spin_e2e_${count}`,
      }),
    });
  });
}

/** Stub image generation endpoint (not needed for tests). */
export async function mockImages(context: BrowserContext) {
  await context.route('**/api/v1/images/generate', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: '{"error":"unavailable"}',
    }),
  );
}

/** Mock /auth/register to succeed. */
export async function mockRegister(context: BrowserContext) {
  await context.route('**/api/v1/auth/register', (route) =>
    route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify(makeAuthTokenResponse()),
    }),
  );
}

/** Mock /auth/login to return 401. */
export async function mockLoginError(
  context: BrowserContext,
  message = 'Invalid credentials',
) {
  await context.route('**/api/v1/auth/login', (route) =>
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: message }),
    }),
  );
}

/** Mock /auth/logout to succeed. */
export async function mockLogout(context: BrowserContext) {
  await context.route('**/api/v1/auth/logout', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{}',
    }),
  );
}

// ── Convenience bundles ────────────────────────────────────────────────

/** Set up all mocks needed for authenticated game tests. */
export async function mockGameApis(context: BrowserContext) {
  await mockAuth(context);
  await mockGameInit(context);
  await mockSpin(context);
  await mockImages(context);
}
