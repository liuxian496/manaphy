import * as dotenv from 'dotenv';

/**
 * 加载环境变量配置
 * quiet 用于屏蔽 dotenv 自带的推广横幅输出
 */
dotenv.config({ quiet: true });

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `缺少环境变量 ${name}。本地请复制 .env.example 为 .env 并填写；CI 请在 GitLab CI/CD Variables 中配置。`
    );
  }
  return value;
}

export const BASE_URL =
  process.env.BASE_URL ?? 'https://liuxian496.github.io/litten-form/';

/**
 * 用户认证信息文件路径
 */
export const AUTH_FILE = '.auth/user.json';

/**
 * 获取测试用户的认证信息
 * @returns 测试用户的认证信息对象，包含 email 和 password 字段。
 * @returns
 */
export function getCredentials() {
  return {
    email: required('TEST_USER_EMAIL'),
    password: required('TEST_USER_PASSWORD'),
  };
}
