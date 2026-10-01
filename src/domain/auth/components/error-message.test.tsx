import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ErrorMessage } from './error-message';

describe('ErrorMessage', () => {
  it('넘겨받은 문구를 줄마다 보여준다', () => {
    render(<ErrorMessage lines={['첫째 줄 문구', '둘째 줄 문구']} />);

    expect(screen.getByText('첫째 줄 문구')).toBeVisible();
    expect(screen.getByText('둘째 줄 문구')).toBeVisible();
    expect(screen.getByRole('alert')).toHaveTextContent('첫째 줄 문구둘째 줄 문구');
  });
});
