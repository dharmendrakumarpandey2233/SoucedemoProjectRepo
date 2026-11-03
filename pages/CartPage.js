const { expect } = require('@playwright/test');

class CartPage {
  constructor(page) {
    this.page = page;
    this.removeButtons = page.getByRole('button', { name: 'Remove', exact: true });
    this.itemQuantity = page.locator('[data-test="item-quantity"]');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout', exact: true });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping', exact: true });
  }

  async verifyProduct(productName) {
    await expect(this.page.getByText(productName, { exact: true })).toBeVisible();
  }

  async verifySingleItemQuantity() {
    await expect(this.itemQuantity).toHaveText('1');
  }

  async verifyPrice(pricePattern) {
    await expect(this.page.getByText(pricePattern)).toBeVisible();
  }

  async removeFirstProduct() {
    await this.removeButtons.first().click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}

module.exports = { CartPage };
