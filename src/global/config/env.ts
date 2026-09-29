import { z } from 'zod';

const envSchema = z.object({
  /** 실행 환경. 값이 없으면 local 로 본다. */
  NEXT_PUBLIC_APP_ENV: z.enum(['local', 'dev', 'prod']).default('local'),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
});

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables: ${JSON.stringify(z.flattenError(parsed.error).fieldErrors)}`,
  );
}

export const env = parsed.data;

export type Env = typeof env;
