export const CATEGORIES = ['KOREAN', 'CHINESE', 'JAPANESE', 'WESTERN', 'OTHERS'] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  KOREAN: '한식',
  CHINESE: '중식',
  JAPANESE: '일식',
  WESTERN: '양식',
  OTHERS: '기타',
};
