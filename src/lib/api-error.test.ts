import { describe, expect, it } from 'vitest';

import { ApiError } from './api-error';

describe('ApiError', () => {
  it('오류 코드와 설명을 담는다', () => {
    const error = new ApiError('RECIPE_NOT_FOUND', '레시피를 찾을 수 없습니다.');

    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe('RECIPE_NOT_FOUND');
    expect(error.message).toBe('레시피를 찾을 수 없습니다.');
  });
});
