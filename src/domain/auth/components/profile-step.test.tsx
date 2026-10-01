import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProfileStep, type ProfileValues } from './profile-step';

const emptyValues: ProfileValues = {
  nickname: '',
  email: '',
  profileImageUrl: null,
  preferredCategory: null,
};

function renderStep(props: Partial<Parameters<typeof ProfileStep>[0]> = {}) {
  const handlers = { onChange: vi.fn(), onPrevious: vi.fn(), onNext: vi.fn() };
  const view = render(
    <ProfileStep values={emptyValues} errorMessage={null} {...handlers} {...props} />,
  );
  return { ...handlers, ...view };
}

function choosePhoto(name: string) {
  const file = new File(['png'], name, { type: 'image/png' });
  fireEvent.change(screen.getByLabelText('프로필 사진'), { target: { files: [file] } });
}

function categorySelect() {
  return screen.getByRole('combobox', { name: '선호 카테고리' });
}

describe('ProfileStep', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('2단계에 입력 요소와 버튼이 보인다', () => {
    renderStep();

    expect(screen.getByPlaceholderText('닉네임')).toBeVisible();
    expect(screen.getByPlaceholderText('이메일')).toBeVisible();
    expect(categorySelect()).toBeVisible();
    expect(screen.getByText('프로필 사진')).toBeVisible();
    expect(screen.getByRole('button', { name: '이전' })).toBeVisible();
    expect(screen.getByRole('button', { name: '다음' })).toBeVisible();
  });

  it('넘겨받은 닉네임과 이메일을 보여준다', () => {
    renderStep({ values: { ...emptyValues, nickname: '집밥', email: 'cook02@example.com' } });

    expect(screen.getByPlaceholderText('닉네임')).toHaveValue('집밥');
    expect(screen.getByPlaceholderText('이메일')).toHaveValue('cook02@example.com');
  });

  it('글자를 넣으면 콜백이 어느 칸의 어떤 값인지 받는다', () => {
    const { onChange } = renderStep();

    fireEvent.change(screen.getByPlaceholderText('닉네임'), { target: { value: '집' } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('nickname', '집');
  });

  it('선호 카테고리의 선택지가 다섯이다', () => {
    renderStep();

    const options = within(categorySelect()).getAllByRole('option');

    expect(options.map((option) => option.textContent)).toEqual([
      '한식',
      '중식',
      '일식',
      '양식',
      '기타',
    ]);
  });

  it('고르지 않은 상태에서는 안내 글자가 보인다', () => {
    renderStep();

    expect(categorySelect()).toHaveDisplayValue('선호 카테고리');
  });

  it('카테고리를 고르면 콜백이 그 값을 받는다', () => {
    const { onChange } = renderStep();

    fireEvent.change(categorySelect(), { target: { value: 'WESTERN' } });

    expect(onChange).toHaveBeenCalledWith('preferredCategory', 'WESTERN');
  });

  it('넘겨받은 카테고리의 화면 글자를 보여준다', () => {
    renderStep({ values: { ...emptyValues, preferredCategory: 'KOREAN' } });

    expect(categorySelect()).toHaveDisplayValue('한식');
  });

  it('파일 선택이 이미지 파일만 받는다', () => {
    renderStep();

    const input = screen.getByLabelText('프로필 사진');

    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', 'image/*');
  });

  it('사진을 고르면 콜백이 그 사진의 주소를 받는다', async () => {
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:test/1') });
    const { onChange } = renderStep();

    choosePhoto('first.png');

    await waitFor(() => expect(onChange).toHaveBeenCalledWith('profileImageUrl', 'blob:test/1'));
  });

  it('프로필 사진 주소가 있으면 그 사진을 보여준다', () => {
    const { container } = renderStep({
      values: { ...emptyValues, profileImageUrl: 'blob:test/1' },
    });

    expect(screen.getByRole('img')).toHaveAttribute('src', 'blob:test/1');
    expect(container.querySelector('label svg')).not.toBeInTheDocument();
  });

  it('프로필 사진 주소가 없으면 사진을 보여주지 않는다', () => {
    const { container } = renderStep();

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('label svg')).toBeInTheDocument();
  });

  it('사진이 있어도 다른 사진을 고를 수 있다', async () => {
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:test/2') });
    const { onChange } = renderStep({
      values: { ...emptyValues, profileImageUrl: 'blob:test/1' },
    });

    choosePhoto('second.png');

    await waitFor(() => expect(onChange).toHaveBeenCalledWith('profileImageUrl', 'blob:test/2'));
  });

  it('이전과 다음을 누르면 각 콜백이 불린다', () => {
    const { onPrevious, onNext } = renderStep();
    const next = screen.getByRole('button', { name: '다음' });

    fireEvent.click(screen.getByRole('button', { name: '이전' }));
    fireEvent.click(next);

    expect(next).toBeEnabled();
    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('오류 문구를 받으면 보여준다', () => {
    renderStep({ errorMessage: '닉네임을 입력해주세요.' });

    expect(screen.getByText('닉네임을 입력해주세요.')).toBeVisible();
  });
});
