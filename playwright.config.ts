
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration.
 * Override the target site with:  BASE_URL=https://example.com npx playwright test
 */
export default defineConfig({
  testDir: './tests',

  // Tests are independent, so they can run in parallel.
  fullyParallel: true,

  // Fail the CI build if a test.only is accidentally committed.
  forbidOnly: !!process.env.CI,

  // Retry only on CI, so flaky tests are visible locally but do not block the pipeline.
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',

    // SauceDemo marks elements with data-test, so getByTestId() works against it.
    testIdAttribute: 'data-test',

    // Evidence is collected only when it is useful.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
