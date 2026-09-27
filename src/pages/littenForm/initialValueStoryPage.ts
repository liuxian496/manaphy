import { expect, FrameLocator, Locator, Page } from '@playwright/test';

/** Storybook manager 页地址，query-only 相对引用以保留 baseURL 的路径段 */
const STORY_PATH = '?path=/story/test-litten-form--initial-value';

export interface LittenFormValues {
  role: string;
  fruit: boolean;
}

/**
 * LittenForm 的 initial-value story 页面。
 * 控件渲染在 Storybook 的预览 iframe 内，所有 locator 都以该 frame 为根。
 */
export class InitialValueStoryPage {
  private readonly page: Page;
  private readonly preview: FrameLocator;
  private readonly roleInput: Locator;
  private readonly fruitCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.preview = page.frameLocator(
      'iframe[title="storybook-preview-iframe"]'
    );
    this.roleInput = this.preview.getByTestId('roleTextField');
    this.fruitCheckbox = this.preview.getByRole('checkbox', { name: 'Fruit:' });
  }

  /**
   * 打开 story 页面
   */
  async goto(): Promise<void> {
    await this.page.goto(STORY_PATH, { waitUntil: 'domcontentloaded' });
  }

  /**
   * 等待 story 控件可交互。
   * Storybook 先渲染 manager 外壳再异步挂载预览 iframe，控件出现晚于导航完成。
   */
  async waitForStoryReady(): Promise<void> {
    await expect(this.roleInput).toBeVisible();
  }

  /**
   * 填写 role 字段
   */
  async fillRole(value: string): Promise<void> {
    await this.roleInput.fill(value);
  }

  /**
   * 勾选 Fruit 复选框
   */
  async checkFruit(): Promise<void> {
    await this.fruitCheckbox.check();
  }

  /**
   * 读取表单当前全部字段值
   */
  async readFormValues(): Promise<LittenFormValues> {
    return {
      role: await this.roleInput.inputValue(),
      fruit: await this.fruitCheckbox.isChecked(),
    };
  }
}
