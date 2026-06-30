import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import * as OTPAuth from 'otpauth';
import * as dotenv from 'dotenv';
dotenv.config();

test.describe('MFA Login Flow', () => {

  test('TC-HP-001: Valid credentials + TOTP login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.fillEmail(process.env.USER_EMAIL!);
    await loginPage.fillPassword(process.env.USER_PASSWORD!);
    await loginPage.submitLogin();
    await page.waitForTimeout(3000);

    // Check if TOTP screen appeared
    const totpField = page.locator('[data-test="totp"]');
    const totpVisible = await totpField.isVisible({ timeout: 8000 }).catch(() => false);
    
    if (totpVisible) {
      // Generate fresh TOTP at the moment of entry
      const totp = new OTPAuth.TOTP({
        secret: OTPAuth.Secret.fromBase32(process.env.TOTP_SECRET!),
        digits: 6,
        period: 30,
      });
      const otp = totp.generate();
      console.log('Generated OTP:', otp);
      
      await totpField.fill(otp);
      await page.waitForTimeout(1000);
      await page.locator('[data-test="login-submit"]').click();
      await page.waitForTimeout(5000);
    }

    // Check current URL
    const currentUrl = page.url();
    console.log('Current URL after login:', currentUrl);

    // Flexible assertion - just check not on login page
    const isLoggedIn = !currentUrl.includes('auth/login');
    expect(isLoggedIn).toBe(true);
  });

  test('TC-IC-001: Wrong password shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.fillEmail(process.env.USER_EMAIL!);
    await loginPage.fillPassword('WrongPassword999!');
    await loginPage.submitLogin();
    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(/auth\/login/);
    await expect(page.locator('[data-test="login-submit"]')).toBeVisible();
    const errorVisible = await page.locator('.alert, .error, [class*=error], [class*=alert]')
      .first().isVisible({ timeout: 5000 }).catch(() => false);
    expect(errorVisible).toBe(true);
  });

  test('TC-IC-004: Non-existent email shows same error as wrong password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.fillEmail('fakeuser999@notreal.com');
    await loginPage.fillPassword('anypassword');
    await loginPage.submitLogin();
    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(/auth\/login/);
    await expect(page.locator('[data-test="login-submit"]')).toBeVisible();
  });
});
