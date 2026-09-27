import { test as setup } from '@playwright/test';
import { HomePage } from '../src/pages/home/homePage.js';
import { AUTH_FILE } from '../src/utils/env.js';
/**
 * 全局登录初始化，保存会话状态到 storageState 文件中。
 * 需要根据应用的登录逻辑进行调整。
 */
setup('登录', async ({ page }) => {
  const home = new HomePage(page);
  await setup.step('导航到门户首页', async () => {
    await home.goto();
  });

  await setup.step('等待门户首页就绪', async () => {
    await home.waitForSignedIn();
  });

  // 不落盘则 chromium project 的 storageState 指向不存在的文件，所有 spec 直接报错
  await setup.step('保存认证状态到 storageState', async () => {
    await page.context().storageState({ path: AUTH_FILE });
  });
});
