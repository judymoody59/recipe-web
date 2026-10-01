import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithQueryClient } from '@/test/render-with-query-client';

import { resetAccounts } from '../../api/accounts';
import { login } from '../../api/login';
import { SIGN_UP_MESSAGES } from '../../utils/sign-up-validation';
import { FigmaSignUpFlow } from './sign-up-flow';

const { push, revokeObjectURL } = vi.hoisted(() => ({
  push: vi.fn(),
  revokeObjectURL: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

function type(placeholder: string, value: string) {
  fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value } });
}

function click(name: string) {
  fireEvent.click(screen.getByRole('button', { name }));
}

function currentStep() {
  return document.querySelector('[aria-current="step"]');
}

function fillCredentials(loginId: string, password: string, passwordConfirm: string) {
  type('아이디', loginId);
  type('비밀번호', password);
  type('비밀번호 확인', passwordConfirm);
}

function passCredentials(loginId = 'cook02') {
  fillCredentials(loginId, 'password2', 'password2');
  click('다음');
}

function fillProfile() {
  type('닉네임', '집밥');
  type('이메일', 'cook02@example.com');
}

function categorySelect() {
  return screen.getByRole('combobox', { name: '선호 카테고리' });
}

async function choosePhoto(url: string) {
  vi.stubGlobal('URL', { createObjectURL: vi.fn(() => url), revokeObjectURL });
  const file = new File(['png'], 'photo.png', { type: 'image/png' });
  fireEvent.change(screen.getByLabelText('프로필 사진'), { target: { files: [file] } });
  await waitFor(() => expect(screen.getByRole('img')).toHaveAttribute('src', url));
}

async function completeSignUp() {
  passCredentials();
  fillProfile();
  click('다음');
  await screen.findByText('회원가입이 성공적으로');
}

function expectNoValidationMessage() {
  for (const message of Object.values(SIGN_UP_MESSAGES)) {
    expect(screen.queryByText(message)).not.toBeInTheDocument();
  }
}

describe('FigmaSignUpFlow', () => {
  let unmount: () => void;

  beforeEach(() => {
    resetAccounts();
    push.mockClear();
    revokeObjectURL.mockClear();
    ({ unmount } = renderWithQueryClient(<FigmaSignUpFlow />));
  });

  // 화면을 치울 때 사진 주소를 해제하므로, 주소 대역을 걷기 전에 먼저 치운다.
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('1단계로 시작하고 입력값이 비어 있다', () => {
    expect(screen.getByPlaceholderText('아이디')).toHaveValue('');
    expect(screen.getByPlaceholderText('비밀번호')).toHaveValue('');
    expect(screen.getByPlaceholderText('비밀번호 확인')).toHaveValue('');
    expect(currentStep()).toHaveTextContent('아이디/비밀번호 설정');
  });

  it('취소를 누르면 대조 화면의 로그인으로 이동한다', () => {
    click('취소');

    expect(push).toHaveBeenCalledWith('/login2');
  });

  it('1단계에서 여러 규칙에 걸려도 처음 걸린 문구 하나만 보이고 1단계에 머문다', () => {
    fillCredentials('abc', 'short', 'other');
    click('다음');

    expect(screen.getByText('아이디는 4자 이상 입력해주세요.')).toBeVisible();
    expect(screen.queryByText('비밀번호는 8자 이상 입력해주세요.')).not.toBeInTheDocument();
    expect(screen.queryByText('비밀번호가 일치하지 않습니다.')).not.toBeInTheDocument();
    expect(currentStep()).toHaveTextContent('아이디/비밀번호 설정');
  });

  it('1단계를 통과하면 2단계로 가고 문구가 없다', () => {
    passCredentials();

    expect(currentStep()).toHaveTextContent('프로필 설정');
    expect(screen.getByPlaceholderText('닉네임')).toBeVisible();
    expectNoValidationMessage();
  });

  it('2단계에서 이메일 형식이 틀리면 문구가 보이고 2단계에 머문다', () => {
    passCredentials();
    type('닉네임', '집밥');
    type('이메일', 'cook02');
    click('다음');

    expect(screen.getByText('이메일 형식이 올바르지 않습니다.')).toBeVisible();
    expect(currentStep()).toHaveTextContent('프로필 설정');
  });

  it('단계를 오가도 양쪽 입력값이 그대로 있다', async () => {
    passCredentials();
    fillProfile();
    await choosePhoto('blob:test/1');
    fireEvent.change(categorySelect(), { target: { value: 'WESTERN' } });

    click('이전');

    expect(screen.getByPlaceholderText('아이디')).toHaveValue('cook02');
    expect(screen.getByPlaceholderText('비밀번호')).toHaveValue('password2');
    expect(screen.getByPlaceholderText('비밀번호 확인')).toHaveValue('password2');

    click('다음');

    expect(screen.getByPlaceholderText('닉네임')).toHaveValue('집밥');
    expect(screen.getByPlaceholderText('이메일')).toHaveValue('cook02@example.com');
    expect(screen.getByRole('img')).toHaveAttribute('src', 'blob:test/1');
    expect(categorySelect()).toHaveDisplayValue('양식');
  });

  it('2단계의 문구가 1단계에 따라오지 않는다', () => {
    passCredentials();
    click('다음');

    click('이전');

    expect(currentStep()).toHaveTextContent('아이디/비밀번호 설정');
    expectNoValidationMessage();
  });

  it('1→2→3단계를 진행하면 완료 화면이 보인다', async () => {
    await completeSignUp();

    expect(screen.getByText('회원가입이 성공적으로')).toBeVisible();
    expect(screen.getByText('완료되었습니다!')).toBeVisible();
    expect(currentStep()).toHaveTextContent('회원가입 완료');
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
      '마이페이지로 이동',
      '홈으로 이동',
    ]);
  });

  it('완료 화면의 버튼은 눌러도 이동하지 않는다', async () => {
    await completeSignUp();

    click('마이페이지로 이동');
    click('홈으로 이동');

    expect(push).not.toHaveBeenCalled();
  });

  it('고른 사진과 카테고리가 가입한 계정에 담긴다', async () => {
    passCredentials();
    fillProfile();
    await choosePhoto('blob:test/1');
    fireEvent.change(categorySelect(), { target: { value: 'WESTERN' } });
    click('다음');
    await screen.findByText('회원가입이 성공적으로');

    const { user } = await login({ loginId: 'cook02', password: 'password2' });

    expect(user).toMatchObject({
      nickname: '집밥',
      email: 'cook02@example.com',
      profileImageUrl: 'blob:test/1',
      preferredCategory: 'WESTERN',
    });
  });

  it('이미 있는 아이디면 1단계로 돌아가 중복 문구가 보이고 입력값이 그대로 있다', async () => {
    passCredentials('recipe01');
    fillProfile();
    click('다음');
    await screen.findByText('이미 사용 중인 아이디입니다.');

    expect(currentStep()).toHaveTextContent('아이디/비밀번호 설정');
    expect(screen.getByPlaceholderText('아이디')).toHaveValue('recipe01');

    type('아이디', 'cook03');
    click('다음');

    expect(screen.getByPlaceholderText('닉네임')).toHaveValue('집밥');
    expect(screen.getByPlaceholderText('이메일')).toHaveValue('cook02@example.com');
  });

  it('사진을 바꾸면 앞서 고른 사진의 주소를 해제한다', async () => {
    passCredentials();
    await choosePhoto('blob:test/1');

    await choosePhoto('blob:test/2');

    expect(revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test/1');
  });

  it('가입하지 않고 화면을 떠나면 고른 사진의 주소를 해제한다', async () => {
    passCredentials();
    await choosePhoto('blob:test/1');

    unmount();

    expect(revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test/1');
  });

  it('가입한 계정에 담긴 사진의 주소는 화면을 떠나도 해제하지 않는다', async () => {
    passCredentials();
    fillProfile();
    await choosePhoto('blob:test/1');
    click('다음');
    await screen.findByText('회원가입이 성공적으로');

    unmount();

    expect(revokeObjectURL).not.toHaveBeenCalled();
  });
});
