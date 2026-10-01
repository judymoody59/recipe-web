import { beforeEach, describe, expect, it } from 'vitest';

import type { SignUpRequest } from '../types/user';
import { resetAccounts } from './accounts';
import { login } from './login';
import { signUp } from './sign-up';

const request: SignUpRequest = {
  loginId: 'cook02',
  password: 'password2',
  nickname: '집밥',
  email: 'cook02@example.com',
  profileImageUrl: null,
  preferredCategory: null,
};

describe('더미 계정 저장', () => {
  beforeEach(() => {
    resetAccounts();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('가입한 계정으로 로그인된다', async () => {
    await signUp(request);

    const response = await login({ loginId: 'cook02', password: 'password2' });

    expect(response.user.loginId).toBe('cook02');
  });

  it('계정 저장을 되돌리면 가입한 계정이 사라진다', async () => {
    await signUp(request);

    resetAccounts();

    await expect(login({ loginId: 'cook02', password: 'password2' })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    });
    await expect(login({ loginId: 'recipe01', password: 'pass1234' })).resolves.toMatchObject({
      user: { loginId: 'recipe01' },
    });
  });

  it('로그인과 회원가입이 브라우저 저장소에 아무것도 쓰지 않는다', async () => {
    await signUp(request);
    await login({ loginId: 'cook02', password: 'password2' });

    expect(localStorage).toHaveLength(0);
    expect(sessionStorage).toHaveLength(0);
  });
});
