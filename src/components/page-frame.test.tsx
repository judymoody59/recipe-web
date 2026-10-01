import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PageFrame } from './page-frame';

describe('PageFrame', () => {
  it('화면 틀이 상단 바와 내용을 함께 그린다', () => {
    render(<PageFrame>내용</PageFrame>);

    expect(screen.getByText('로고')).toBeVisible();
    expect(screen.getByText('내용')).toBeVisible();
  });
});
