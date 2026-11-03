const { test, expect } = require('../fixtures/base.fixture');
const loginData = require('../test-data/login.json');

test.describe('SauceDemo shopping flow', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await page.goto('/');
    await loginPage.enterUsername(loginData.validUser.username);
    await loginPage.enterPassword(loginData.validUser.password);
    await loginPage.clickLogin();
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test('shows all products and sorts them by name descending', async ({ productsPage }) => {
    expect(await productsPage.getProductCount()).toBe(loginData.products.count);

    await productsPage.selectSortOrder('Name (Z to A)');

    const productNames = await productsPage.getProductNames();
    expect(productNames[0]).toBe(loginData.products.firstInNameDescending);
  });

  test('adds a product to the cart, validates quantity and price, then removes it', async ({
    productsPage,
    cartPage,
    page,
  }) => {
    await productsPage.addFirstProductToCart();
    await expect(productsPage.cartButton).toContainText('1');
    await productsPage.openCart();

    await cartPage.verifyProduct(loginData.products.backpack);
    await cartPage.verifySingleItemQuantity();
    await cartPage.verifyPrice(/\$ ?29\.99/);
    await cartPage.removeFirstProduct();

    await expect(page.getByText(loginData.products.backpack, { exact: true })).toHaveCount(0);
  });

  test('validates checkout details, completes an order, and logs out', async ({
    page,
    productsPage,
    cartPage,
    checkoutPage,
    loginPage,
  }) => {
    await productsPage.addFirstProductToCart();
    await productsPage.openCart();
    await cartPage.verifyProduct(loginData.products.backpack);
    await cartPage.checkout();

    await checkoutPage.continueCheckout();
    await checkoutPage.verifyCheckoutError(loginData.errors.firstNameRequired);

    await checkoutPage.enterInformation(loginData.checkout);
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await checkoutPage.verifySummaryProduct(loginData.products.backpack);
    await checkoutPage.verifySummaryTotal(loginData.products.backpackTotal);

    await checkoutPage.finishOrder();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await checkoutPage.verifyOrderComplete();

    await page.getByRole('button', { name: 'Back Home', exact: true }).click();
    await productsPage.logout();
    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.loginButton).toBeVisible();

    await page.goto('/inventory.html');
    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
