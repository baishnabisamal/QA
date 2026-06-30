import { Page } from '@playwright/test';

export class CartPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/checkout');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
  }

  async isCartVisible(): Promise<boolean> {
    return await this.page.locator('body').isVisible();
  }

  async getCartItemCount(): Promise<number> {
    return await this.page.locator('[data-test="cart-quantity"]').count();
  }
}
