const { expect } = require('@playwright/test');

class ProductsPage {
  constructor(page) {
    this.page = page;
    this.productTitleButtons = page.locator('[id^="item_"][id$="_title_link"]');
    this.sortControl = page.getByRole('combobox', { name: 'Sort products' });
    this.addToCartButtons = page.getByRole('button', { name: 'Add to cart', exact: true });
    this.removeButtons = page.getByRole('button', { name: 'Remove', exact: true });
    this.cartButton = page.getByRole('button', { name: /Cart/ });
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async getProductNames() {
    return this.productTitleButtons.allTextContents();
  }

  async getProductCount() {
    return this.productTitleButtons.count();
  }

  async selectSortOrder(label) {
    await this.sortControl.selectOption({ label });
  }

  async addFirstProductToCart() {
    await this.addToCartButtons.first().click();
  }

  async openCart() {
    await this.cartButton.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutButton.click();
  }

  async verifyInventoryPage() {
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
  }
}

module.exports = { ProductsPage };
