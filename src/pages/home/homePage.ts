import { expect, Locator, Page } from '@playwright/test';
import { BASE_URL } from '../../utils/env.js';

export class HomePage {
  private readonly page: Page;
  private readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.getByRole('link', { name: 'LittenForm' });
  }

  /**
   * 导航到门户首页并等待页面初始化完成
   */
  async goto(): Promise<void> {
    await this.page.goto('./', { waitUntil: 'domcontentloaded' });
  }

  /**
   * 等待门户首页登录完成且首屏可交互。
   * 未就绪就落盘 storageState 会保存无效会话，因此是后续操作的前置同步而非验收。
   */
  async waitForSignedIn(): Promise<void> {
    const portalOrigin = new URL(BASE_URL).origin;
    await this.page.waitForURL(url => url.origin === portalOrigin);

    await expect(this.logo).toBeVisible();
  }
}
