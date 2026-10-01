import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PersonIcon } from './icons/person-icon';
import { TextField } from './text-field';

describe('TextField', () => {
  it('placeholder 글자로 입력칸을 찾을 수 있다', () => {
    render(<TextField icon={<PersonIcon />} placeholder="아이디" value="" onChange={vi.fn()} />);

    expect(screen.getByPlaceholderText('아이디')).toBe(
      screen.getByRole('textbox', { name: '아이디' }),
    );
  });

  it('글자를 넣으면 콜백이 그 값을 받는다', () => {
    const onChange = vi.fn();
    render(<TextField icon={<PersonIcon />} placeholder="아이디" value="" onChange={onChange} />);

    fireEvent.change(screen.getByPlaceholderText('아이디'), { target: { value: 'recipe01' } });

    expect(onChange).toHaveBeenLastCalledWith('recipe01');
  });

  it('넘겨받은 값을 보여준다', () => {
    render(
      <TextField icon={<PersonIcon />} placeholder="아이디" value="recipe01" onChange={vi.fn()} />,
    );

    expect(screen.getByPlaceholderText('아이디')).toHaveValue('recipe01');
  });

  it('비밀번호 종류는 값을 가린다', () => {
    render(
      <TextField
        icon={<PersonIcon />}
        placeholder="비밀번호"
        type="password"
        value=""
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByPlaceholderText('비밀번호')).toHaveAttribute('type', 'password');
  });

  it('아이콘이 보조 기술에서 숨겨진다', () => {
    render(<TextField icon={<PersonIcon />} placeholder="아이디" value="" onChange={vi.fn()} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
