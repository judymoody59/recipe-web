import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithQueryClient } from '@/test/render-with-query-client';

import { resetAccounts } from '../api/accounts';
import { LoginForm } from './login-form';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

const ERROR_LINE_1 = '아이디 또는 비밀번호를 잘못 입력했습니다.';
const ERROR_LINE_2 = '입력하신 내용을 다시 확인해주세요.';

function type(placeholder: string, value: string) {
  fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value } });
}

function loginButton() {
  return screen.getByRole('button', { name: '로그인' });
}

async function failLogin(loginId: string, password: string) {
  type('아이디', loginId);
  type('비밀번호', password);
  fireEvent.click(loginButton());
  await screen.findByText(ERROR_LINE_1);
}

describe('LoginForm', () => {
  beforeEach(() => {
    resetAccounts();
    push.mockClear();
    localStorage.clear();
    sessionStorage.clear();
    renderWithQueryClient(<LoginForm />);
  });

  it('처음 화면에 제목·입력칸·버튼·링크가 보인다', () => {
    expect(screen.getByRole('heading', { name: '로그인' })).toBeVisible();
    expect(screen.getByPlaceholderText('아이디')).toBeVisible();
    expect(screen.getByPlaceholderText('비밀번호')).toBeVisible();
    expect(loginButton()).toBeVisible();
    expect(screen.getByRole('link', { name: '회원가입' })).toHaveAttribute('href', '/signup');
  });

  it('비밀번호 입력칸이 값을 가린다', () => {
    expect(screen.getByPlaceholderText('비밀번호')).toHaveAttribute('type', 'password');
  });

  it('입력 전에는 로그인 버튼이 비활성이다', () => {
    expect(loginButton()).toBeDisabled();
  });

  it('아이디만 입력하면 로그인 버튼이 비활성이다', () => {
    type('아이디', 'recipe01');

    expect(loginButton()).toBeDisabled();
  });

  it('둘 다 입력하면 로그인 버튼이 활성이 된다', () => {
    type('아이디', 'recipe01');
    type('비밀번호', 'pass1234');

    expect(loginButton()).toBeEnabled();
  });

  it('입력한 값을 지우면 로그인 버튼이 다시 비활성이 된다', () => {
    type('아이디', 'recipe01');
    type('비밀번호', 'pass1234');
    type('비밀번호', '');

    expect(loginButton()).toBeDisabled();
  });

  it('시드 계정으로 로그인하면 홈으로 이동한다', async () => {
    type('아이디', 'recipe01');
    type('비밀번호', 'pass1234');
    fireEvent.click(loginButton());

    await waitFor(() => expect(push).toHaveBeenCalledWith('/'));
    expect(screen.queryByText(ERROR_LINE_1)).not.toBeInTheDocument();
    expect(screen.queryByText(ERROR_LINE_2)).not.toBeInTheDocument();
  });

  it('없는 아이디로 로그인하면 오류 문구가 보인다', async () => {
    await failLogin('nobody', 'pass1234');

    expect(screen.getByText(ERROR_LINE_1)).toBeVisible();
    expect(screen.getByText(ERROR_LINE_2)).toBeVisible();
    expect(push).not.toHaveBeenCalled();
  });

  it('비밀번호가 틀려도 같은 오류 문구가 보인다', async () => {
    await failLogin('recipe01', 'wrong1234');

    expect(screen.getByText(ERROR_LINE_1)).toBeVisible();
    expect(screen.getByText(ERROR_LINE_2)).toBeVisible();
    expect(push).not.toHaveBeenCalled();
  });

  it('로그인에 실패해도 입력값이 그대로 있다', async () => {
    await failLogin('nobody', 'pass1234');

    expect(screen.getByPlaceholderText('아이디')).toHaveValue('nobody');
    expect(screen.getByPlaceholderText('비밀번호')).toHaveValue('pass1234');
  });

  it('입력값을 고치는 동안 오류 문구가 그대로 있다', async () => {
    await failLogin('nobody', 'pass1234');

    type('아이디', 'recipe01');

    expect(screen.getByText(ERROR_LINE_1)).toBeVisible();
    expect(screen.getByText(ERROR_LINE_2)).toBeVisible();
  });

  it('다시 눌러 성공하면 홈으로 이동한다', async () => {
    await failLogin('nobody', 'pass1234');

    type('아이디', 'recipe01');
    fireEvent.click(loginButton());

    await waitFor(() => expect(push).toHaveBeenCalledWith('/'));
  });

  it('로그인에 성공해도 브라우저 저장소가 비어 있다', async () => {
    type('아이디', 'recipe01');
    type('비밀번호', 'pass1234');
    fireEvent.click(loginButton());

    await waitFor(() => expect(push).toHaveBeenCalledWith('/'));
    expect(localStorage).toHaveLength(0);
    expect(sessionStorage).toHaveLength(0);
  });
});
