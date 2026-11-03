const fs = require('node:fs/promises');
const path = require('node:path');
const { test: baseTest } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductsPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');

const test = baseTest.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'failed') {
    return;
  }

  const screenshotsDirectory = path.resolve(process.cwd(), 'screenshots');
  const safeTestId = testInfo.testId.replace(/[^a-zA-Z0-9._-]+/g, '_');
  const screenshotPath = path.join(
    screenshotsDirectory,
    `${safeTestId}-retry-${testInfo.retry}.png`,
  );

  await fs.mkdir(screenshotsDirectory, { recursive: true });
  await page.screenshot({ path: screenshotPath });
});

module.exports = { test, expect: baseTest.expect };
