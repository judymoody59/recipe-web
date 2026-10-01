import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './button';

describe('Button', () => {
  it('버튼을 누르면 콜백이 불린다', () => {
    const onClick = vi.fn();
    render(
      <Button variant="muted" onClick={onClick}>
        다음
      </Button>,
    );

    fireEvent.click(screen.getByRole('button', { name: '다음' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('비활성 버튼은 눌러도 콜백이 불리지 않는다', () => {
    const onClick = vi.fn();
    render(
      <Button variant="muted" disabled onClick={onClick}>
        로그인
      </Button>,
    );
    const button = screen.getByRole('button', { name: '로그인' });

    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });
});
