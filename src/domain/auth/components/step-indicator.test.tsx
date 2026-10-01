import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StepIndicator, type SignUpStep } from './step-indicator';

describe('StepIndicator', () => {
  it('단계 표시에 세 단계의 글자가 순서대로 보인다', () => {
    render(<StepIndicator currentStep={1} />);

    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      '아이디/비밀번호 설정',
      '프로필 설정',
      '회원가입 완료',
    ]);
  });

  it.each<[SignUpStep, string]>([
    [1, '아이디/비밀번호 설정'],
    [2, '프로필 설정'],
    [3, '회원가입 완료'],
  ])('현재 단계가 %i 이면 "%s" 알약 하나만 현재로 표시된다', (currentStep, label) => {
    const { container } = render(<StepIndicator currentStep={currentStep} />);

    const current = container.querySelectorAll('[aria-current="step"]');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent(label);
  });

  it('알약이 누르는 요소가 아니다', () => {
    render(<StepIndicator currentStep={2} />);
    const indicator = within(screen.getByRole('list', { name: '회원가입 단계' }));

    expect(indicator.queryByRole('button')).not.toBeInTheDocument();
    expect(indicator.queryByRole('link')).not.toBeInTheDocument();
  });
});
