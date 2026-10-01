import { z } from 'zod';

export const SIGN_UP_MESSAGES = {
  loginIdTooShort: '아이디는 4자 이상 입력해주세요.',
  passwordTooShort: '비밀번호는 8자 이상 입력해주세요.',
  passwordMismatch: '비밀번호가 일치하지 않습니다.',
  nicknameRequired: '닉네임을 입력해주세요.',
  emailInvalid: '이메일 형식이 올바르지 않습니다.',
  loginIdDuplicated: '이미 사용 중인 아이디입니다.',
} as const;

export type CredentialsInput = {
  loginId: string;
  password: string;
  passwordConfirm: string;
};

export type ProfileInput = {
  nickname: string;
  email: string;
};

// `@` 가 하나이고, 그 앞과 뒤가 비어 있지 않고, 뒤쪽에 `.` 이 있으며, 공백이 없다.
function isEmail(value: string): boolean {
  if (/\s/.test(value)) return false;
  const parts = value.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  return !!local && !!domain && domain.includes('.');
}

// 필드를 적은 순서가 검사 순서다. 비밀번호 확인은 앞의 두 규칙을 통과한 뒤에 견준다.
const credentialsSchema = z
  .object({
    loginId: z.string().min(4, SIGN_UP_MESSAGES.loginIdTooShort),
    password: z.string().min(8, SIGN_UP_MESSAGES.passwordTooShort),
    passwordConfirm: z.string(),
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    message: SIGN_UP_MESSAGES.passwordMismatch,
    path: ['passwordConfirm'],
  });

const profileSchema = z.object({
  nickname: z.string().min(1, SIGN_UP_MESSAGES.nicknameRequired),
  email: z.string().refine(isEmail, SIGN_UP_MESSAGES.emailInvalid),
});

function firstMessage(result: z.ZodSafeParseResult<unknown>): string | null {
  if (result.success) return null;
  return result.error.issues[0]?.message ?? null;
}

// 처음 걸린 규칙의 문구를 돌려준다. 통과하면 null 이다.
export function validateCredentials(input: CredentialsInput): string | null {
  return firstMessage(credentialsSchema.safeParse(input));
}

export function validateProfile(input: ProfileInput): string | null {
  return firstMessage(profileSchema.safeParse(input));
}
