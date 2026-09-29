import { describe, expect, it } from 'vitest';

import { cn } from './cn';

describe('cn', () => {
  it('거짓 값은 버리고 조건이 참인 클래스만 합친다', () => {
    const hidden = false;
    expect(cn('px-2', hidden && 'hidden', undefined, null, { 'font-bold': true })).toBe(
      'px-2 font-bold',
    );
  });

  it('충돌하는 Tailwind 유틸리티는 나중 것만 남긴다', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });
});
