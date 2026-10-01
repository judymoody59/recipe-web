import { useMutation } from '@tanstack/react-query';

import { signUp } from '../api/sign-up';
import type { SignUpRequest, User } from '../types/user';

export function useSignUp() {
  return useMutation<User, Error, SignUpRequest>({ mutationFn: signUp });
}
