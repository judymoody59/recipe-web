import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TopBar } from './top-bar';

describe('TopBar', () => {
  it('상단 바에 로고 글자가 보인다', () => {
    render(<TopBar />);

    expect(screen.getByText('로고')).toBeVisible();
  });

  it('상단 바에 누르는 요소가 없다', () => {
    render(<TopBar />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
