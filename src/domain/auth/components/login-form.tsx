'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/button';
import { ArrowIcon } from '@/components/icons/arrow-icon';
import { PersonIcon } from '@/components/icons/person-icon';
import { ShieldIcon } from '@/components/icons/shield-icon';
import { TextField } from '@/components/text-field';
import { ApiError } from '@/lib/api-error';
import { cn } from '@/lib/cn';

import { useLogin } from '../hooks/use-login';
import { ErrorMessage } from './error-message';

const INVALID_CREDENTIALS_LINES = [
  '아이디 또는 비밀번호를 잘못 입력했습니다.',
  '입력하신 내용을 다시 확인해주세요.',
];

export function LoginForm() {
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
    <div className="flex flex-col items-center pb-[120px]">
      <h1 className="mt-[130px] text-[36px] leading-[44px] font-bold text-black">로그인</h1>
      <TextField
        icon={<PersonIcon />}
        placeholder="아이디"
        value={loginId}
        onChange={setLoginId}
        className="mt-[68px]"
      />
      <TextField
        icon={<ShieldIcon />}
        placeholder="비밀번호"
        type="password"
        value={password}
        onChange={setPassword}
        className="mt-[30px]"
      />
      {/* 오류 문구가 보이는 동안 아래 요소가 38px 내려간다. */}
      <div className={cn('w-[600px]', hasError ? 'pt-[36px] pb-[23px]' : 'h-[85px]')}>
        {hasError && <ErrorMessage lines={INVALID_CREDENTIALS_LINES} />}
      </div>
      <Button
        variant={canSubmit ? 'primary' : 'muted'}
        disabled={!canSubmit}
        onClick={handleLogin}
        className="h-[120px] w-[600px]"
      >
        로그인
      </Button>
      <Link
        href="/signup"
        className="mt-[26px] inline-flex items-center gap-[8px] text-[24px] leading-[32px] font-normal text-[#949698]"
      >
        회원가입
        <ArrowIcon />
      </Link>
    </div>
  );
}
