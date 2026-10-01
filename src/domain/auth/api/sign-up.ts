import { ApiError } from '@/lib/api-error';

import type { SignUpRequest, User } from '../types/user';
import { addAccount, findAccount, nextUserId, toUser, type Account } from './accounts';

// UTC 기준, 초 단위까지의 ISO 8601 문자열
function currentTimestamp(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export async function signUp(request: SignUpRequest): Promise<User> {
  if (findAccount(request.loginId)) {
    throw new ApiError('DUPLICATED_LOGIN_ID', '이미 쓰이는 로그인 아이디입니다.');
  }
  const now = currentTimestamp();
  const account: Account = {
    userId: nextUserId(),
    loginId: request.loginId,
    password: request.password,
    nickname: request.nickname,
    email: request.email,
    profileImageUrl: request.profileImageUrl ?? null,
    preferredCategory: request.preferredCategory ?? null,
    role: 'USER',
    createdAt: now,
    updatedAt: now,
  };
  addAccount(account);
  return toUser(account);
}
