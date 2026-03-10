/** Route-interception helpers for API mocking in tests. */

import type { BrowserContext } from '@playwright/test';
import {
  makeAuthTokenResponse,
  makeGameInitResponse,
  makeSpinResponse,
  makeRouletteInitResponse,
  makeRouletteSpinResponse,
  makeAmericanRouletteInitResponse,
  makeAmericanRouletteSpinResponse,
  makeHistoryResponse,
  makeRoundDetailResponse,
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

// ── Error mocks ───────────────────────────────────────────────────────

/** Mock /spin to return a server error. */
export async function mockSpinError(
  context: BrowserContext,
  status = 500,
  message = 'Internal server error',
) {
  await context.route('**/api/v1/spin', (route) =>
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ error: message }),
    }),
  );
}

/** Mock /game/init to return an error. */
export async function mockGameInitError(
  context: BrowserContext,
  status = 500,
  message = 'Game initialization failed',
) {
  await context.route('**/api/v1/game/init', (route) =>
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ error: message }),
    }),
  );
}

// ── Roulette ──────────────────────────────────────────────────────────

/** Mock /roulette/init to return a valid session. */
export async function mockRouletteInit(context: BrowserContext) {
  await context.route('**/api/v1/roulette/init', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(makeRouletteInitResponse()),
    }),
  );
}

/** Mock /roulette/spin to return a result. */
export async function mockRouletteSpin(
  context: BrowserContext,
  overrides?: Record<string, unknown>,
) {
  await context.route('**/api/v1/roulette/spin', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(makeRouletteSpinResponse(overrides)),
    }),
  );
}

/** Mock /american-roulette/init to return a valid session. */
export async function mockAmericanRouletteInit(context: BrowserContext) {
  await context.route('**/api/v1/american-roulette/init', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(makeAmericanRouletteInitResponse()),
    }),
  );
}

/** Mock /american-roulette/spin to return a result. */
export async function mockAmericanRouletteSpin(
  context: BrowserContext,
  overrides?: Record<string, unknown>,
) {
  await context.route('**/api/v1/american-roulette/spin', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(makeAmericanRouletteSpinResponse(overrides)),
    }),
  );
}

// ── History ───────────────────────────────────────────────────────────

/** Mock /history endpoint. */
export async function mockHistory(
  context: BrowserContext,
  overrides?: Record<string, unknown>,
) {
  await context.route('**/api/v1/history?*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(makeHistoryResponse(overrides)),
    }),
  );
  // Also match without query params
  await context.route('**/api/v1/history', (route) => {
    if (route.request().url().includes('?')) return route.fallback();
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(makeHistoryResponse(overrides)),
    });
  });
}

/** Mock /history/:id round detail endpoint. */
export async function mockRoundDetail(
  context: BrowserContext,
  overrides?: Record<string, unknown>,
) {
  await context.route('**/api/v1/history/spin_*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(makeRoundDetailResponse(overrides)),
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

/** Set up mocks for European roulette tests. */
export async function mockRouletteApis(context: BrowserContext) {
  await mockAuth(context);
  await mockRouletteInit(context);
  await mockRouletteSpin(context);
  await mockImages(context);
}

/** Set up mocks for American roulette tests. */
export async function mockAmericanRouletteApis(context: BrowserContext) {
  await mockAuth(context);
  await mockAmericanRouletteInit(context);
  await mockAmericanRouletteSpin(context);
  await mockImages(context);
}

/** Set up mocks for history page tests. */
export async function mockHistoryApis(context: BrowserContext) {
  await mockAuth(context);
  await mockHistory(context);
  await mockRoundDetail(context);
  await mockImages(context);
}
