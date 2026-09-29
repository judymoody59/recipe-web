import { describe, expect, it } from 'vitest';

import { parseEnv } from './env';

describe('parseEnv', () => {
  it.each(['local', 'dev', 'prod'])('허용값 %s 는 그대로 돌려준다', (value) => {
    expect(parseEnv({ NEXT_PUBLIC_APP_ENV: value }).NEXT_PUBLIC_APP_ENV).toBe(value);
  });

  it('값이 설정되지 않았으면 local 로 본다', () => {
    expect(parseEnv({ NEXT_PUBLIC_APP_ENV: undefined }).NEXT_PUBLIC_APP_ENV).toBe('local');
  });

  it('키 자체가 없으면 local 로 본다', () => {
    expect(parseEnv({}).NEXT_PUBLIC_APP_ENV).toBe('local');
  });

  it('빈 문자열이면 local 로 본다', () => {
    expect(parseEnv({ NEXT_PUBLIC_APP_ENV: '' }).NEXT_PUBLIC_APP_ENV).toBe('local');
  });

  it.each(['staging', ' '])('허용하지 않는 값 "%s" 는 예외를 던진다', (value) => {
    expect(() => parseEnv({ NEXT_PUBLIC_APP_ENV: value })).toThrow(/Invalid environment variables/);
  });
});
