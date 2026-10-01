import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { SignUpRequest } from '../types/user';
import { resetAccounts } from './accounts';
import { login } from './login';
import { signUp } from './sign-up';

const request: SignUpRequest = {
  loginId: 'cook02',
  password: 'password2',
  nickname: '집밥',
  email: 'cook02@example.com',
  profileImageUrl: 'blob:test/1',
  preferredCategory: 'WESTERN',
};

describe('signUp', () => {
  beforeEach(() => {
    resetAccounts();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('회원가입하면 만들어진 사용자를 돌려준다', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-02T03:04:05Z'));

    await expect(signUp(request)).resolves.toEqual({
      userId: 2,
      loginId: 'cook02',
      nickname: '집밥',
      email: 'cook02@example.com',
      profileImageUrl: 'blob:test/1',
      preferredCategory: 'WESTERN',
      role: 'USER',
      createdAt: '2025-01-02T03:04:05Z',
      updatedAt: '2025-01-02T03:04:05Z',
    });
  });

  it('선택 값이 없으면 필드를 빼지 않고 null 로 둔다', async () => {
    const user = await signUp({ ...request, profileImageUrl: null, preferredCategory: null });

    expect(user).toHaveProperty('profileImageUrl', null);
    expect(user).toHaveProperty('preferredCategory', null);
  });

  it('회원가입 응답에 비밀번호가 없다', async () => {
    const user = await signUp(request);

    expect(user).not.toHaveProperty('password');
  });

  it('가입할 때마다 사용자 식별자가 1씩 커진다', async () => {
    const first = await signUp(request);
    const second = await signUp({ ...request, loginId: 'cook03' });

    expect(first.userId).toBe(2);
    expect(second.userId).toBe(3);
  });

  it('시드 계정의 아이디로 가입하면 실패한다', async () => {
    await expect(signUp({ ...request, loginId: 'recipe01' })).rejects.toMatchObject({
      code: 'DUPLICATED_LOGIN_ID',
    });

    await expect(login({ loginId: 'recipe01', password: 'password2' })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    });
  });

  it('같은 세션에서 가입한 아이디로 다시 가입하면 실패한다', async () => {
    await signUp(request);

    await expect(signUp(request)).rejects.toMatchObject({ code: 'DUPLICATED_LOGIN_ID' });
  });
});
