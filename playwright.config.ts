import { defineConfig, devices } from '@playwright/test';
import { AUTH_FILE, BASE_URL } from './src/utils/env.js';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // CI 环境下禁止使用 test.only
  retries: process.env.CI ? 2 : 0,
  // CI 环境下限制并行 worker 数量，避免资源竞争
  workers: process.env.CI ? 1 : undefined,
  timeout: 60_000,
  expect: { timeout: 15_000 },

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'results.xml' }],
  ],

  use: {
    baseURL: BASE_URL,
    // actionTimeout 同时是 waitForResponse / locator.waitFor 的默认预算，POM 内不再另写字面量
    actionTimeout: 45_000,
    navigationTimeout: 45_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      // 用于全局初始化的 setup 项目
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      timeout: 180_000,
    },
    {
      // Chromium 浏览器配置
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: AUTH_FILE },
      dependencies: ['setup'],
    },
  ],
});
