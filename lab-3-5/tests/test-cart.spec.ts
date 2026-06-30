import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CartPage } from '../pages/CartPage';
import * as OTPAuth from 'otpauth';
import * as dotenv from 'dotenv';
dotenv.config();

async function loginUser(page: Page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.fillEmail(process.env.USER_EMAIL!);
  await loginPage.fillPassword(process.env.USER_PASSWORD!);
  await loginPage.submitLogin();
  await page.waitForTimeout(3000);
  const totpField = page.locator('[data-test="totp"]');
  if (await totpField.isVisible({ timeout: 5000 }).catch(() => false)) {
    const totp = new OTPAuth.TOTP({
      secret: OTPAuth.Secret.fromBase32(process.env.TOTP_SECRET!),
      digits: 6,
      period: 30,
    });
    await totpField.fill(totp.generate());
    await page.locator('[data-test="login-submit"]').click();
    await page.waitForTimeout(3000);
  }
}

test.describe('Cart Flow (Policy Assignment Equivalent)', () => {

  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('TC-CART-001: Cart page accessible after login', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await expect(page).toHaveURL(/checkout/);
    await expect(page).not.toHaveURL(/auth\/login/);
  });

  test('TC-CART-002: Adding item reflects in cart', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-test="product-name"]').first().click();
    await page.locator('[data-test="add-to-cart"]').click();
    await page.waitForTimeout(1000);
    const cartCount = page.locator('[data-test="cart-quantity"]');
    await expect(cartCount).toBeVisible();
    const countText = await cartCount.textContent();
    expect(Number(countText)).toBeGreaterThan(0);
  });

  test('TC-CART-003: Cart page shows correct structure', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await expect(page).toHaveURL(/checkout/);
    await expect(page.locator('body')).toBeVisible();
  });
});
