import { Page } from '@playwright/test';

export class ProductPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(process.env.BASE_URL + '/#/');
    await this.page.waitForLoadState('networkidle');
  }

  async getFirstProductName(): Promise<string> {
    const firstProduct = this.page.locator('.card-title').first();
    return await firstProduct.textContent() || '';
  }

  async clickFirstProduct() {
    await this.page.locator('.card-title').first().click();
  }

  async addToCart() {
    await this.page.getByRole('button', { name: /add to cart/i }).click();
  }

  async isProductListVisible(): Promise<boolean> {
    return await this.page.locator('.card').first().isVisible();
  }
}