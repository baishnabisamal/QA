import { Page } from '@playwright/test';

export class LoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com');
    await this.page.waitForLoadState('networkidle');
    await this.page.locator('[data-test="nav-sign-in"]').click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
  }

  async fillEmail(email: string) {
    const emailField = this.page.locator('[data-test="email"]');
    await emailField.waitFor({ state: 'visible', timeout: 15000 });
    await emailField.fill(email);
  }

  async fillPassword(password: string) {
    const pwField = this.page.locator('[data-test="password"]');
    await pwField.waitFor({ state: 'visible', timeout: 15000 });
    await pwField.fill(password);
  }

  async submitLogin() {
    await this.page.locator('[data-test="login-submit"]').click();
  }

  async enterTOTP(otp: string) {
    await this.page.locator('[data-test="totp"]').fill(otp);
    await this.page.locator('[data-test="login-submit"]').click();
  }

  async verifyLoginSuccess() {
    await this.page.waitForURL(/account/, { timeout: 15000 });
  }
}
