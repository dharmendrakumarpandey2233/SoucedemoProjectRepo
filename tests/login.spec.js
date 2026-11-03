const { test, expect } = require('../fixtures/base.fixture');
const loginData = require('../test-data/login.json');

test.describe('SauceDemo login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('allows a standard user to log in and view products', async ({ page, loginPage }) => {
    await loginPage.enterUsername(loginData.validUser.username);
    await loginPage.enterPassword(loginData.validUser.password);
    await loginPage.clickLogin();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByText(loginData.products.backpack, { exact: true })).toBeVisible();
  });

  test('shows a clear error for invalid credentials', async ({ loginPage }) => {
    await loginPage.enterUsername(loginData.invalidUser.username);
    await loginPage.enterPassword(loginData.invalidUser.password);
    await loginPage.clickLogin();

    await loginPage.verifyLoginError(loginData.errors.invalidCredentials);
  });

  test('requires a username when the login form is submitted empty', async ({ loginPage }) => {
    await loginPage.clickLogin();

    await loginPage.verifyLoginError(loginData.errors.usernameRequired);
  });

  test('does not allow a locked-out user to sign in', async ({ loginPage }) => {
    await loginPage.enterUsername(loginData.lockedUser.username);
    await loginPage.enterPassword(loginData.lockedUser.password);
    await loginPage.clickLogin();

    await loginPage.verifyLoginError(loginData.errors.lockedUser);
  });
});
