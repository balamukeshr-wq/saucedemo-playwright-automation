# SauceDemo Playwright Automation

![Playwright CI](https://github.com/balamukeshr-wq/saucedemo-playwright-automation/actions/workflows/playwright.yml/badge.svg)

Automated UI tests for the SauceDemo e-commerce site using Playwright and TypeScript. The suite validates critical user journeys and regression points across login, inventory, cart, and checkout flows.

## What it tests

- Login behavior for valid and invalid users, including lockout and error handling
- Inventory page loading, product visibility, sorting, and cart badge updates
- Cart actions such as adding/removing products and continuing shopping
- End-to-end checkout flow, including required-field validation and totals
- Smoke coverage for the primary user journey and regression checks for edge cases

## Coverage table

| Area | Test count | Key scenarios |
| --- | ---: | --- |
| Login | 12 | valid login, invalid credentials, missing fields, logout, blocked direct access |
| Inventory | 6 | six-product catalog, sorting A-Z/Z-A and price order, add/remove actions |
| Cart | 3 | display selected products, remove single item, continue shopping |
| Checkout | 6 | happy path purchase, required field validation, total/tax calculation, cancel flow |
| Smoke | 1 | login lands on the inventory page |

Total: 28 tests, executed across 3 browsers = 84 browser runs. 4 of them are tagged `@smoke` (`npm run test:smoke`).

## Run commands

```bash
npm install
npx playwright install
npm test
npm run test:smoke
npm run typecheck
npm run report
```

Requires Node 20.19 or newer. To run a single browser: `npx playwright test --project=chromium`.

## Project structure

```text
.
├── .github/
│   └── workflows/
│       └── playwright.yml
├── data/
│   ├── products.ts
│   └── users.ts
├── fixtures/
│   └── base.ts
├── pages/
│   ├── CartPage.ts
│   ├── CheckoutCompletePage.ts
│   ├── CheckoutInfoPage.ts
│   ├── CheckoutOverviewPage.ts
│   ├── InventoryPage.ts
│   └── LoginPage.ts
├── tests/
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   ├── inventory.spec.ts
│   ├── login/
│   │   └── login.spec.ts
│   └── smoke/
│       └── smoke.spec.ts
├── utils/
│   ├── customer.ts
│   └── price.ts
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

## Design decisions

- Page Object Model (POM): each page is encapsulated in a dedicated class so tests stay readable and maintainable.
- Shared fixtures: reusable browser/page setups centralize login and common state transitions in `fixtures/base.ts`.
- Data-driven tests: login error cases and checkout validation scenarios are generated from arrays of test inputs rather than duplicated specs.
- Faker-generated test data: customer identities for checkout are created dynamically with `@faker-js/faker` to avoid hardcoded values.
- Tag-based execution: tests are tagged with `@smoke` and `@regression` so smoke coverage can be run separately from broader regression checks.
- Multi-browser support: Playwright runs against Chromium, Firefox, and WebKit from the shared configuration.

## CI

The project includes a GitHub Actions workflow that installs dependencies, launches Playwright browsers, runs the suite, and uploads the HTML report as an artifact.

## Notes

-  Base URL defaults to SauceDemo (`https://www.saucedemo.com`); override it with `BASE_URL=https://example.com npx playwright test`.
- `testIdAttribute` is configured as `data-test` so selectors align with the app's stable test hooks.
- Evidence is collected only when useful: screenshots and video on failure, and a trace on the first retry (CI).


## Stability notes

- Navigation waits on page content (the page title), not only the URL. SauceDemo is a single-page app, so the URL can change before the new view renders.
- `performance_glitch_user` has a deliberately slow login, so that test allows a longer load timeout (20 s) while other tests keep the 5 s default.
- Retries run only on CI (`retries: 2`) and CI reports tests that passed only on retry as flaky.
