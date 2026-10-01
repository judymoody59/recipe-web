import type { Category } from '@/domain/recipe/types/category';

export type Role = 'USER' | 'ADMIN';

export type User = {
  userId: number;
  loginId: string;
  nickname: string;
  email: string;
  profileImageUrl: string | null;
  preferredCategory: Category | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

export type LoginRequest = {
  loginId: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: User;
};

export type SignUpRequest = {
  loginId: string;
  password: string;
  nickname: string;
  email: string;
  profileImageUrl: string | null;
  preferredCategory: Category | null;
};
