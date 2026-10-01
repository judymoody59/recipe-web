import { ApiError } from '@/lib/api-error';

import type { LoginRequest, LoginResponse } from '../types/user';
import { findAccount, toUser } from './accounts';

export async function login({ loginId, password }: LoginRequest): Promise<LoginResponse> {
  const account = findAccount(loginId);
  if (!account || account.password !== password) {
    throw new ApiError('INVALID_CREDENTIALS', '로그인 아이디 또는 비밀번호가 틀렸습니다.');
  }
  return {
    accessToken: `dummy-access-token-${account.userId}`,
    user: toUser(account),
  };
}
