import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithQueryClient } from '@/test/render-with-query-client';

import { resetAccounts } from '../api/accounts';
import { login } from '../api/login';
import { SIGN_UP_MESSAGES } from '../utils/sign-up-validation';
import { SignUpFlow } from './sign-up-flow';

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

async function signUpWithDuplicatedLoginId() {
  passCredentials('recipe01');
  fillProfile();
  click('다음');
  await screen.findByText('이미 사용 중인 아이디입니다.');
}

function expectNoValidationMessage() {
  for (const message of Object.values(SIGN_UP_MESSAGES)) {
    expect(screen.queryByText(message)).not.toBeInTheDocument();
  }
}

describe('SignUpFlow', () => {
  let unmount: () => void;

  beforeEach(() => {
    resetAccounts();
    push.mockClear();
    revokeObjectURL.mockClear();
    localStorage.clear();
    sessionStorage.clear();
    ({ unmount } = renderWithQueryClient(<SignUpFlow />));
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

  it('1단계 규칙에 걸리면 문구가 보이고 1단계에 머문다', () => {
    fillCredentials('abc', 'password2', 'password2');
    click('다음');

    expect(screen.getByText('아이디는 4자 이상 입력해주세요.')).toBeVisible();
    expect(screen.queryByPlaceholderText('닉네임')).not.toBeInTheDocument();
  });

  it('여러 규칙에 걸려도 문구는 하나만 보인다', () => {
    fillCredentials('abc', 'short', 'other');
    click('다음');

    expect(screen.getByText('아이디는 4자 이상 입력해주세요.')).toBeVisible();
    expect(screen.queryByText('비밀번호는 8자 이상 입력해주세요.')).not.toBeInTheDocument();
    expect(screen.queryByText('비밀번호가 일치하지 않습니다.')).not.toBeInTheDocument();
  });

  it('입력값을 고치는 동안 문구가 그대로 있다', () => {
    fillCredentials('abc', 'password2', 'password2');
    click('다음');

    type('아이디', 'cook02');

    expect(screen.getByText('아이디는 4자 이상 입력해주세요.')).toBeVisible();
  });

  it('다시 눌러 통과하면 2단계로 가고 문구가 없다', () => {
    fillCredentials('abc', 'password2', 'password2');
    click('다음');
    type('아이디', 'cook02');

    click('다음');

    expect(currentStep()).toHaveTextContent('프로필 설정');
    expectNoValidationMessage();
  });

  it('다시 눌러 다른 규칙에 걸리면 그 문구로 바뀐다', () => {
    fillCredentials('abc', 'password2', 'password2');
    click('다음');
    type('아이디', 'cook02');
    type('비밀번호 확인', 'password3');

    click('다음');

    expect(screen.getByText('비밀번호가 일치하지 않습니다.')).toBeVisible();
    expect(screen.queryByText('아이디는 4자 이상 입력해주세요.')).not.toBeInTheDocument();
    expect(screen.queryByText('비밀번호는 8자 이상 입력해주세요.')).not.toBeInTheDocument();
  });

  it('취소를 누르면 로그인 화면으로 이동한다', () => {
    click('취소');

    expect(push).toHaveBeenCalledWith('/login');
  });

  it('2단계에서 닉네임이 비면 문구가 보이고 2단계에 머문다', () => {
    passCredentials();
    type('이메일', 'cook02@example.com');
    click('다음');

    expect(screen.getByText('닉네임을 입력해주세요.')).toBeVisible();
    expect(currentStep()).toHaveTextContent('프로필 설정');
  });

  it('2단계에서 이메일 형식이 틀리면 문구가 보인다', () => {
    passCredentials();
    type('닉네임', '집밥');
    type('이메일', 'cook02');
    click('다음');

    expect(screen.getByText('이메일 형식이 올바르지 않습니다.')).toBeVisible();
    expect(currentStep()).toHaveTextContent('프로필 설정');
  });

  it('이전으로 돌아가면 1단계 입력값이 그대로 있다', () => {
    passCredentials();

    click('이전');

    expect(screen.getByPlaceholderText('아이디')).toHaveValue('cook02');
    expect(screen.getByPlaceholderText('비밀번호')).toHaveValue('password2');
    expect(screen.getByPlaceholderText('비밀번호 확인')).toHaveValue('password2');
  });

  it('다시 2단계로 오면 2단계 입력값이 그대로 있다', async () => {
    passCredentials();
    fillProfile();
    await choosePhoto('blob:test/1');
    fireEvent.change(categorySelect(), { target: { value: 'WESTERN' } });

    click('이전');
    click('다음');

    expect(screen.getByPlaceholderText('닉네임')).toHaveValue('집밥');
    expect(screen.getByPlaceholderText('이메일')).toHaveValue('cook02@example.com');
    expect(screen.getByRole('img')).toHaveAttribute('src', 'blob:test/1');
    expect(categorySelect()).toHaveDisplayValue('양식');
  });

  it('2단계의 문구가 1단계에 따라오지 않는다', () => {
    passCredentials();
    type('이메일', 'cook02@example.com');
    click('다음');

    click('이전');

    expect(currentStep()).toHaveTextContent('아이디/비밀번호 설정');
    expectNoValidationMessage();
  });

  it('2단계의 문구는 2단계로 돌아오면 그대로 있다', () => {
    passCredentials();
    type('이메일', 'cook02@example.com');
    click('다음');
    click('이전');

    click('다음');

    expect(screen.getByText('닉네임을 입력해주세요.')).toBeVisible();
  });

  it('사진과 카테고리 없이 가입하면 완료 화면이 보인다', async () => {
    await completeSignUp();

    expect(screen.getByText('회원가입이 성공적으로')).toBeVisible();
    expect(screen.getByText('완료되었습니다!')).toBeVisible();
    expect(currentStep()).toHaveTextContent('회원가입 완료');
  });

  it('완료 화면에 이전·다음 버튼이 없다', async () => {
    await completeSignUp();

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
    expect(screen.getByText('회원가입이 성공적으로')).toBeVisible();
    expect(screen.getByText('완료되었습니다!')).toBeVisible();
  });

  it('가입한 계정이 입력한 값으로 만들어진다', async () => {
    await completeSignUp();

    const { user } = await login({ loginId: 'cook02', password: 'password2' });

    expect(user).toMatchObject({
      nickname: '집밥',
      email: 'cook02@example.com',
      profileImageUrl: null,
      preferredCategory: null,
    });
  });

  it('고른 사진과 카테고리가 가입 요청에 담긴다', async () => {
    passCredentials();
    fillProfile();
    await choosePhoto('blob:test/1');
    fireEvent.change(categorySelect(), { target: { value: 'WESTERN' } });
    click('다음');
    await screen.findByText('회원가입이 성공적으로');

    const { user } = await login({ loginId: 'cook02', password: 'password2' });

    expect(user).toMatchObject({ profileImageUrl: 'blob:test/1', preferredCategory: 'WESTERN' });
  });

  it('가입만으로 로그인되지 않는다', async () => {
    await completeSignUp();

    expect(push).not.toHaveBeenCalled();
    expect(localStorage).toHaveLength(0);
    expect(sessionStorage).toHaveLength(0);
  });

  it('이미 있는 아이디면 1단계로 돌아가 중복 문구가 보인다', async () => {
    await signUpWithDuplicatedLoginId();

    expect(currentStep()).toHaveTextContent('아이디/비밀번호 설정');
    expect(screen.getByText('이미 사용 중인 아이디입니다.')).toBeVisible();
  });

  it('중복으로 돌아와도 입력값이 그대로 있다', async () => {
    await signUpWithDuplicatedLoginId();

    expect(screen.getByPlaceholderText('아이디')).toHaveValue('recipe01');
    expect(screen.getByPlaceholderText('비밀번호')).toHaveValue('password2');
    expect(screen.getByPlaceholderText('비밀번호 확인')).toHaveValue('password2');

    type('아이디', 'cook03');
    click('다음');

    expect(screen.getByPlaceholderText('닉네임')).toHaveValue('집밥');
    expect(screen.getByPlaceholderText('이메일')).toHaveValue('cook02@example.com');
    expect(screen.queryByText('이미 사용 중인 아이디입니다.')).not.toBeInTheDocument();
  });

  it('중복을 고친 뒤 가입된다', async () => {
    await signUpWithDuplicatedLoginId();
    type('아이디', 'cook03');
    click('다음');

    click('다음');

    expect(await screen.findByText('회원가입이 성공적으로')).toBeVisible();
    expect(screen.getByText('완료되었습니다!')).toBeVisible();
  });

  it('사진을 바꾸면 앞서 고른 사진의 주소를 해제한다', async () => {
    passCredentials();
    await choosePhoto('blob:test/1');

    await choosePhoto('blob:test/2');

    expect(revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test/1');
  });

  it('단계를 오가는 동안에는 고른 사진의 주소를 해제하지 않는다', async () => {
    passCredentials();
    await choosePhoto('blob:test/1');

    click('이전');
    click('다음');

    expect(revokeObjectURL).not.toHaveBeenCalled();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'blob:test/1');
  });

  it('가입하지 않고 화면을 떠나면 고른 사진의 주소를 해제한다', async () => {
    passCredentials();
    await choosePhoto('blob:test/1');
    await choosePhoto('blob:test/2');
    await choosePhoto('blob:test/3');
    click('이전');

    unmount();

    expect(revokeObjectURL.mock.calls).toEqual([['blob:test/1'], ['blob:test/2'], ['blob:test/3']]);
  });

  it('사진을 고르지 않고 화면을 떠나면 해제할 주소가 없다', () => {
    vi.stubGlobal('URL', { revokeObjectURL });
    passCredentials();

    unmount();

    expect(revokeObjectURL).not.toHaveBeenCalled();
  });

  it('가입한 계정에 담긴 사진의 주소는 화면을 떠나도 해제하지 않는다', async () => {
    passCredentials();
    fillProfile();
    await choosePhoto('blob:test/1');
    click('다음');
    await screen.findByText('회원가입이 성공적으로');

    unmount();

    expect(revokeObjectURL).not.toHaveBeenCalled();
    const { user } = await login({ loginId: 'cook02', password: 'password2' });
    expect(user.profileImageUrl).toBe('blob:test/1');
  });

  it('아이디 중복으로 가입하지 못한 사진의 주소는 화면을 떠날 때 해제한다', async () => {
    passCredentials('recipe01');
    fillProfile();
    await choosePhoto('blob:test/1');
    click('다음');
    await screen.findByText('이미 사용 중인 아이디입니다.');
    expect(revokeObjectURL).not.toHaveBeenCalled();

    unmount();

    expect(revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test/1');
  });
});
