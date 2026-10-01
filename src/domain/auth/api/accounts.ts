import type { User } from '../types/user';

export type Account = User & { password: string };

const SEED_ACCOUNT: Account = {
  userId: 1,
  loginId: 'recipe01',
  password: 'pass1234',
  nickname: '요리왕',
  email: 'recipe01@example.com',
  profileImageUrl: null,
  preferredCategory: 'KOREAN',
  role: 'USER',
  createdAt: '2024-02-09T09:46:44Z',
  updatedAt: '2024-02-09T09:46:44Z',
};

// 계정은 이 모듈 변수에만 있다. 문서를 다시 읽으면 시드 계정만 남는다.
let accounts: Account[] = [{ ...SEED_ACCOUNT }];

export function findAccount(loginId: string): Account | undefined {
  return accounts.find((account) => account.loginId === loginId);
}

export function addAccount(account: Account): void {
  accounts.push(account);
}

export function nextUserId(): number {
  return Math.max(0, ...accounts.map((account) => account.userId)) + 1;
}

export function toUser(account: Account): User {
  return {
    userId: account.userId,
    loginId: account.loginId,
    nickname: account.nickname,
    email: account.email,
    profileImageUrl: account.profileImageUrl,
    preferredCategory: account.preferredCategory,
    role: account.role,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}

export function resetAccounts(): void {
  accounts = [{ ...SEED_ACCOUNT }];
}
