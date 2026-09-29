import { z } from 'zod';

/** 빈 문자열은 값이 없는 것으로 보고 기본값을 적용한다. */
const emptyAsUndefined = (value: unknown) => (value === '' ? undefined : value);

const envSchema = z.object({
  /** 실행 환경. 값이 없거나 비었으면 local 로 본다. */
  NEXT_PUBLIC_APP_ENV: z.preprocess(
    emptyAsUndefined,
    z.enum(['local', 'dev', 'prod']).default('local'),
  ),
});

export type Env = z.infer<typeof envSchema>;

/** 원시 환경 변수를 검증해 돌려준다. 허용하지 않는 값이면 예외를 던진다. */
export function parseEnv(raw: Record<string, string | undefined>): Env {
  const parsed = envSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `Invalid environment variables: ${JSON.stringify(z.flattenError(parsed.error).fieldErrors)}`,
    );
  }
  return parsed.data;
}

// Next.js 는 process.env.NEXT_PUBLIC_* 를 문자 그대로 참조할 때만 클라이언트 번들에 값을 넣는다.
export const env = parseEnv({
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
});
