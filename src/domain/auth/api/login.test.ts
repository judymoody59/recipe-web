import { beforeEach, describe, expect, it } from 'vitest';

import { resetAccounts } from './accounts';
import { login } from './login';

describe('login', () => {
  beforeEach(() => {
    resetAccounts();
  });

  it('시드 계정으로 로그인하면 토큰과 사용자를 돌려준다', async () => {
    const response = await login({ loginId: 'recipe01', password: 'pass1234' });

    expect(typeof response.accessToken).toBe('string');
    expect(response.accessToken).not.toBe('');
    expect(response.user).toEqual({
      userId: 1,
      loginId: 'recipe01',
      nickname: '요리왕',
      email: 'recipe01@example.com',
      profileImageUrl: null,
      preferredCategory: 'KOREAN',
      role: 'USER',
      createdAt: '2024-02-09T09:46:44Z',
      updatedAt: '2024-02-09T09:46:44Z',
    });
  });

  it('로그인 응답의 사용자에 비밀번호가 없다', async () => {
    const response = await login({ loginId: 'recipe01', password: 'pass1234' });

    expect(response.user).not.toHaveProperty('password');
  });

  it('없는 아이디로 로그인하면 실패한다', async () => {
    await expect(login({ loginId: 'nobody', password: 'pass1234' })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    });
  });

  it('비밀번호가 틀리면 없는 아이디와 같은 오류로 실패한다', async () => {
    await expect(login({ loginId: 'recipe01', password: 'wrong1234' })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    });
  });

  it('아이디의 앞뒤 공백을 떼지 않고 견준다', async () => {
    await expect(login({ loginId: ' recipe01', password: 'pass1234' })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    });
  });
});
