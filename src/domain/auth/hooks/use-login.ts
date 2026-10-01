import { useMutation } from '@tanstack/react-query';

import { login } from '../api/login';
import type { LoginRequest, LoginResponse } from '../types/user';

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginRequest>({ mutationFn: login });
}
