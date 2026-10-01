import { describe, expect, it } from 'vitest';

import { CATEGORIES, CATEGORY_LABELS } from './category';

describe('Category', () => {
  it('카테고리 값 목록이 다섯 값을 정해진 순서로 담는다', () => {
    expect(CATEGORIES).toEqual(['KOREAN', 'CHINESE', 'JAPANESE', 'WESTERN', 'OTHERS']);
  });

  it('카테고리 값마다 화면 글자가 대응한다', () => {
    expect(CATEGORIES.map((category) => CATEGORY_LABELS[category])).toEqual([
      '한식',
      '중식',
      '일식',
      '양식',
      '기타',
    ]);
  });
});
