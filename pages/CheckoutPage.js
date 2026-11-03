const { expect } = require('@playwright/test');

class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.postalCodeInput = page.getByRole('textbox', { name: 'Zip/Postal Code' });
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    this.errorMessage = page.getByText(/^Error:/);
    this.finishButton = page.getByRole('button', { name: 'Finish', exact: true });
    this.orderConfirmation = page.getByRole('heading', { name: 'Thank you for your order!' });
  }

  async enterFirstName(firstName) {
    await this.firstNameInput.fill(firstName);
  }

  async enterLastName(lastName) {
    await this.lastNameInput.fill(lastName);
  }

  async enterPostalCode(postalCode) {
    await this.postalCodeInput.fill(postalCode);
  }

  async continueCheckout() {
    await this.continueButton.click();
  }

  async enterInformation({ firstName, lastName, postalCode }) {
    await this.enterFirstName(firstName);
    await this.enterLastName(lastName);
    await this.enterPostalCode(postalCode);
    await this.continueCheckout();
  }

  async verifyCheckoutError(expectedMessage) {
    await expect(this.errorMessage).toHaveText(expectedMessage);
  }

  async verifySummaryProduct(productName) {
    await expect(this.page.getByText(productName, { exact: true })).toBeVisible();
  }

  async verifySummaryTotal(total) {
    await expect(this.page.getByText(`Total: ${total}`, { exact: true })).toBeVisible();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async verifyOrderComplete() {
    await expect(this.orderConfirmation).toBeVisible();
  }
}

module.exports = { CheckoutPage };
