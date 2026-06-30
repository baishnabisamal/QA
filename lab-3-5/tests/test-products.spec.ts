import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import * as OTPAuth from 'otpauth';
import * as dotenv from 'dotenv';
dotenv.config();

async function loginUser(page: Page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.fillEmail(process.env.USER_EMAIL!);
  await loginPage.fillPassword(process.env.USER_PASSWORD!);
  await loginPage.submitLogin();
  const totp = new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(process.env.TOTP_SECRET!),
    digits: 6,
    period: 30,
  });
  const otp = totp.generate();
  const totpField = page.locator('[data-test="totp"]');
  if (await totpField.isVisible({ timeout: 5000 }).catch(() => false)) {
    await loginPage.enterTOTP(otp);
  }
  await page.waitForURL(/account/);
}

test.describe('Product Browsing Flow', () => {

  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('TC-DEV-001: Product list visible after login', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.goto();
    const isVisible = await productPage.isProductListVisible();
    expect(isVisible).toBe(true);
    const count = await page.locator('[data-test="product-name"]').count();
    expect(count).toBeGreaterThan(0);
    await expect(page).toHaveURL(/practicesoftwaretesting/);
  });

  test('TC-DEV-002: Product detail page opens correctly', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.goto();
    const productName = await productPage.getFirstProductName();
    await productPage.clickFirstProduct();
    await expect(page.locator('[data-test="product-name"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();
    expect(productName.length).toBeGreaterThan(0);
  });

  test('TC-DEV-003: Add product to cart successfully', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.goto();
    await productPage.clickFirstProduct();
    await productPage.addToCart();
    await expect(page.locator('[data-test="cart-quantity"]')).toBeVisible();
  });
});
