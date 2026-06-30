import { Page } from '@playwright/test';

export class DashboardPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/account');
    await this.page.waitForLoadState('networkidle');
  }

  async isVisible(): Promise<boolean> {
    const trigger = this.page.locator('[data-test="nav-menu"]');
    return await trigger.isVisible({ timeout: 8000 }).catch(() => false);
  }

  async logout() {
    // Open the dropdown menu first
    const menuTrigger = this.page.locator('[data-test="nav-menu"]');
    await menuTrigger.click();
    await this.page.waitForTimeout(500);

    // Now click sign out inside the dropdown
    const signOut = this.page.locator('[data-test="nav-sign-out"]');
    await signOut.waitFor({ state: 'visible', timeout: 8000 });
    await signOut.click();
    await this.page.waitForTimeout(2000);
  }
}
