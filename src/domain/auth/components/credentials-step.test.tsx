import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SIGN_UP_MESSAGES, type CredentialsInput } from '../utils/sign-up-validation';
import { CredentialsStep } from './credentials-step';

const emptyValues: CredentialsInput = { loginId: '', password: '', passwordConfirm: '' };

function renderStep(props: Partial<Parameters<typeof CredentialsStep>[0]> = {}) {
  const handlers = { onChange: vi.fn(), onCancel: vi.fn(), onNext: vi.fn() };
  render(<CredentialsStep values={emptyValues} errorMessage={null} {...handlers} {...props} />);
  return handlers;
}

describe('CredentialsStep', () => {
  it('1단계에 입력칸 셋과 버튼 둘이 보인다', () => {
    renderStep();

    expect(screen.getByPlaceholderText('아이디')).toBeVisible();
    expect(screen.getByPlaceholderText('비밀번호')).toBeVisible();
    expect(screen.getByPlaceholderText('비밀번호 확인')).toBeVisible();
    expect(screen.getByRole('button', { name: '취소' })).toBeVisible();
    expect(screen.getByRole('button', { name: '다음' })).toBeVisible();
  });

  it('비밀번호와 비밀번호 확인이 값을 가린다', () => {
    renderStep();

    expect(screen.getByPlaceholderText('비밀번호')).toHaveAttribute('type', 'password');
    expect(screen.getByPlaceholderText('비밀번호 확인')).toHaveAttribute('type', 'password');
  });

  it('넘겨받은 값을 보여준다', () => {
    renderStep({
      values: { loginId: 'cook02', password: 'password2', passwordConfirm: 'password2' },
    });

    expect(screen.getByPlaceholderText('아이디')).toHaveValue('cook02');
    expect(screen.getByPlaceholderText('비밀번호')).toHaveValue('password2');
    expect(screen.getByPlaceholderText('비밀번호 확인')).toHaveValue('password2');
  });

  it('글자를 넣으면 콜백이 어느 칸의 어떤 값인지 받는다', () => {
    const { onChange } = renderStep();

    fireEvent.change(screen.getByPlaceholderText('아이디'), { target: { value: 'c' } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('loginId', 'c');
  });

  it('입력이 비어 있어도 다음 버튼이 눌린다', () => {
    const { onNext } = renderStep();
    const next = screen.getByRole('button', { name: '다음' });

    fireEvent.click(next);

    expect(next).toBeEnabled();
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('취소를 누르면 콜백이 불린다', () => {
    const { onCancel } = renderStep();

    fireEvent.click(screen.getByRole('button', { name: '취소' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('오류 문구를 받으면 보여준다', () => {
    renderStep({ errorMessage: '아이디는 4자 이상 입력해주세요.' });

    expect(screen.getByText('아이디는 4자 이상 입력해주세요.')).toBeVisible();
  });

  it('오류 문구를 받지 않으면 문구가 없다', () => {
    renderStep();

    for (const message of Object.values(SIGN_UP_MESSAGES)) {
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    }
  });
});
