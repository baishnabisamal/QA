import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
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

test.describe('Logout Flow', () => {

  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('TC-SB-003: Logout redirects correctly', async ({ page }) => {
    const dashPage = new DashboardPage(page);
    await dashPage.logout();
    await expect(page).not.toHaveURL(/account/);
    await expect(page.locator('[data-test="nav-sign-in"]')).toBeVisible({ timeout: 8000 });
  });

  test('TC-SB-004: Dashboard not accessible after logout', async ({ page }) => {
    const dashPage = new DashboardPage(page);
    const wasVisible = await dashPage.isVisible();
    expect(wasVisible).toBe(true);
    await dashPage.logout();
    await page.waitForTimeout(1000);
    await page.goto('https://practicesoftwaretesting.com/account');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/login|auth/);
  });
});
