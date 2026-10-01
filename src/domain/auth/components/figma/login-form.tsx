'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ApiError } from '@/lib/api-error';
import { cn } from '@/lib/cn';

import { useLogin } from '../../hooks/use-login';
import { FigmaButton } from './button';
import { FigmaErrorMessage } from './error-message';
import { FigmaTextField } from './text-field';

const INVALID_CREDENTIALS_LINES = [
  '아이디 또는 비밀번호를 잘못 입력했습니다.',
  '입력하신 내용을 다시 확인해주세요.',
];

export function FigmaLoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  const canSubmit = loginId !== '' && password !== '';

  function handleLogin() {
    if (loginMutation.isPending) return;
    loginMutation.mutate(
      { loginId, password },
      {
        onSuccess: () => {
          setHasError(false);
          router.push('/');
        },
        onError: (error) => {
          if (error instanceof ApiError && error.code === 'INVALID_CREDENTIALS') {
            setHasError(true);
          }
        },
      },
    );
  }

  return (
    <div className="ml-660 flex min-h-930 w-601 flex-col items-center">
      <h1 className="mt-140 text-[length:calc(var(--spacing)*36)] leading-25 font-semibold text-black">
        로그인
      </h1>
      <div className="mt-77 flex flex-col gap-30">
        <FigmaTextField icon="person" placeholder="아이디" value={loginId} onChange={setLoginId} />
        <FigmaTextField
          icon="encrypted"
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={setPassword}
        />
      </div>
      {/* 오류 문구가 보이는 동안 아래 요소가 40 내려간다. */}
      <div className={cn(hasError ? 'pt-41 pb-20' : 'h-85')}>
        {hasError && <FigmaErrorMessage lines={INVALID_CREDENTIALS_LINES} />}
      </div>
      {/* 활성 색은 피그마에 없다. 값이 들어간 입력칸의 글자색을 쓴다. */}
      <FigmaButton
        variant={canSubmit ? 'primary' : 'muted'}
        disabled={!canSubmit}
        onClick={handleLogin}
        className="h-120 w-601 rounded-[calc(var(--spacing)*70)]"
      >
        로그인
      </FigmaButton>
      <Link
        href="/signup2"
        className="mt-30 text-[length:calc(var(--spacing)*24)] leading-25 font-medium text-[rgba(41,45,50,0.5)]"
      >
        회원가입 <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
