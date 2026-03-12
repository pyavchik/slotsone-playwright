# SlotsOne Playwright Test Suite

End-to-end test suite for [pyavchik.space](https://pyavchik.space) — an iGaming demo platform built with React, TypeScript, PixiJS, and a Next.js admin panel.

## Tech Stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Test Framework | [Playwright](https://playwright.dev/) ^1.58     |
| Language       | TypeScript                                      |
| Reporting      | Allure (`allure-playwright`) + Playwright HTML   |
| CI/CD          | Jenkins Pipeline                                |
| Target App     | React + Vite + PixiJS (frontend), Node + Express + PostgreSQL (backend), Next.js 14 (admin) |

## Test Coverage

**191 tests** across 4 Playwright projects and 7 functional modules:

| Module          | Tests | Description                                      |
| --------------- | ----: | ------------------------------------------------ |
| Admin Panel     |    60 | Dashboard, Players, Transactions, Games, KYC, Bonuses, Risk, Reports, Settings |
| Slots Game      |    36 | Spin mechanics, paytable, win overlays, keyboard controls, error handling |
| Roulette        |    25 | European (12) and American (13) roulette variants |
| Lobby           |    24 | Game cards, filters, sorting, header interactions |
| History         |    24 | Game history list, filters, pagination, round detail with provably fair |
| CV Landing      |    12 | Page content, navigation links, contact info     |
| Auth            |     7 | Login, registration, tab switching, protected routes |
| **+ Setup**     |     3 | Admin auth setup + admin login form               |

## Project Structure

```
├── fixtures/
│   ├── helpers.ts              # API mocking helpers (auth, game, roulette, history)
│   └── mock-data.ts            # Response factories (game init, spin, roulette, history)
├── pages/                      # Page Object Model
│   ├── auth.page.ts
│   ├── cv-landing.page.ts
│   ├── game.page.ts
│   ├── lobby.page.ts
│   ├── history.page.ts
│   ├── round-detail.page.ts
│   ├── roulette.page.ts
│   ├── american-roulette.page.ts
│   └── admin/                  # 11 admin page objects
│       ├── dashboard.page.ts
│       ├── players.page.ts
│       ├── player-detail.page.ts
│       └── ...
├── tests/
│   ├── base.fixture.ts         # Extended fixture with Allure labels & failure screenshots
│   ├── auth/
│   ├── cv-landing/
│   ├── lobby/
│   ├── slots-game/
│   ├── roulette/
│   ├── history/
│   └── admin/
│       ├── admin.setup.ts      # Auth setup (storageState)
│       ├── login.spec.ts
│       ├── dashboard.spec.ts
│       └── ...
├── playwright.config.ts
├── Jenkinsfile
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm ci
npx playwright install chromium
```

### Environment Variables

Create a `.env` file in the project root:

```env
ADMIN_EMAIL=admin@slotsone.com
ADMIN_PASSWORD=admin123
```

## Running Tests

```bash
# Run all tests
npm test

# Run in headed mode (visible browser)
npm run test:headed

# Run with Playwright UI
npm run test:ui

# Run specific module
npx playwright test tests/lobby/
npx playwright test tests/admin/

# Run specific test file
npx playwright test tests/slots-game/error-handling.spec.ts

# Run tests matching a pattern
npx playwright test -g "retry button"

# Run a specific project only
npx playwright test --project="Admin Panel"
npx playwright test --project="Public Site"
```

## Playwright Projects

| Project       | Purpose                               | Auth              |
| ------------- | ------------------------------------- | ----------------- |
| Public Site   | All non-admin tests (parallel)        | Mocked via `context.route` / `page.route` |
| Admin Setup   | Logs in, saves session to `.auth/`    | Real login        |
| Admin Login   | Login form tests (no auth needed)     | None              |
| Admin Panel   | Authenticated admin tests             | `storageState` from Admin Setup |

## Reporting

### Allure Report

```bash
# Generate report after test run
allure generate allure-results --clean -o allure-report

# Open in browser
allure open allure-report
```

Allure reports include:
- **Suites** — organized by module (Slots Game, Roulette, Lobby, etc.)
- **Behaviors** — epics and features via custom `base.fixture.ts` labels
- **Screenshots** — captured on every test
- **Videos** — retained on failure
- **Traces** — recorded on first retry

### Playwright HTML Report

```bash
npm run report
```

## Architecture

### Page Object Model

Every page has a dedicated class in `pages/` with locators as properties and user actions as methods:

```typescript
// pages/game.page.ts
export class GamePage {
  readonly spinButton: Locator;
  readonly balance: Locator;
  readonly errorToast: Locator;

  async goto(slug: string) { ... }
  async spin() { ... }
}
```

### API Mocking

Public site tests mock all API calls using Playwright route interception. Helpers are centralized in `fixtures/helpers.ts`:

```typescript
// Individual mocks
await mockAuth(context);
await mockGameInit(context);
await mockSpin(context, { total_win: 5.0 });

// Convenience bundles
await mockGameApis(context);       // auth + init + spin + images
await mockRouletteApis(context);   // auth + roulette init + spin + images
await mockHistoryApis(context);    // auth + history + round detail + images
```

Mock data factories in `fixtures/mock-data.ts` support overrides for flexible test scenarios:

```typescript
makeGameInitResponse({ balance: 500 });
makeBigWinSpinResponse(bet);     // 12x multiplier
makeMegaWinSpinResponse(bet);    // 25x multiplier
```

### Admin Test Strategy

Admin tests use **real login and real data** — no API mocking for reads. Authentication is handled once via a setup project that saves `storageState` to `.auth/admin.json`, which all authenticated admin tests reuse.

### Allure Integration

The custom `base.fixture.ts` automatically labels every test with:
- **Epic** (parentSuite) — derived from the test directory name
- **Feature** (suite) — derived from the spec filename

This provides clean grouping in Allure's Behaviors and Suites views without any per-test boilerplate.

## CI/CD

The `Jenkinsfile` defines a pipeline with three stages:

1. **Clean** — Remove previous reports and results
2. **Install** — `npm ci` + install Chromium
3. **Run Tests** — Execute full suite (single worker in CI, retries enabled)

Post-build actions generate and publish both Allure and Playwright HTML reports.

## Application Routes

| Route              | Page                          |
| ------------------ | ----------------------------- |
| `/`                | CV Landing page               |
| `/login`           | Login                         |
| `/register`        | Registration                  |
| `/slots`           | Game lobby                    |
| `/slots/:slug`     | Individual slot game          |
| `/history`         | Game history                  |
| `/round/:id`       | Round detail (provably fair)  |
| `/admin`           | Admin dashboard               |
| `/admin/login`     | Admin login                   |
| `/admin/players`   | Player management             |
| `/admin/transactions` | Transaction history        |
| `/admin/games`     | Game management               |
| `/admin/bonuses`   | Bonus management              |
| `/admin/kyc`       | KYC verification              |
| `/admin/risk`      | Risk monitoring               |
| `/admin/reports`   | Reports                       |
| `/admin/settings`  | System settings               |
