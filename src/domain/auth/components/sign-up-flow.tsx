'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { ApiError } from '@/lib/api-error';

import { useSignUp } from '../hooks/use-sign-up';
import {
  SIGN_UP_MESSAGES,
  validateCredentials,
  validateProfile,
  type CredentialsInput,
} from '../utils/sign-up-validation';
import { CompleteStep } from './complete-step';
import { CredentialsStep } from './credentials-step';
import { ProfileStep, type ProfileValues } from './profile-step';
import { StepIndicator, type SignUpStep } from './step-indicator';

// 단계와 입력값은 이 컴포넌트의 상태로만 있다. 주소와 방문 기록은 단계마다 바뀌지 않는다.
export function SignUpFlow() {
  const router = useRouter();
  const signUpMutation = useSignUp();
  const [step, setStep] = useState<SignUpStep>(1);
  const [credentials, setCredentials] = useState<CredentialsInput>({
    loginId: '',
    password: '',
    passwordConfirm: '',
  });
  const [profile, setProfile] = useState<ProfileValues>({
    nickname: '',
    email: '',
    profileImageUrl: null,
    preferredCategory: null,
  });
  const [credentialsError, setCredentialsError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  // 고른 뒤 아직 가입에 쓰이지 않은 사진의 주소. 올리기 함수가 만든 브라우저 안의 주소는
  // 해제하기 전까지 그 파일을 붙들고 있으므로, 쓰이지 않게 된 주소는 이 화면이 해제한다.
  const unclaimedPhotoUrl = useRef<string | null>(null);

  // 가입하지 않고 화면을 떠나면 고른 사진을 버린다.
  useEffect(() => {
    const unclaimed = unclaimedPhotoUrl;
    return () => {
      if (unclaimed.current !== null) URL.revokeObjectURL(unclaimed.current);
    };
  }, []);

  function handleProfileChange<Field extends keyof ProfileValues>(
    field: Field,
    value: ProfileValues[Field],
  ) {
    if (field === 'profileImageUrl') {
      const nextUrl = value as ProfileValues['profileImageUrl'];
      const previousUrl = unclaimedPhotoUrl.current;
      // 다른 사진으로 바꾸면 앞의 사진은 더 쓰이지 않는다.
      if (previousUrl !== null && previousUrl !== nextUrl) URL.revokeObjectURL(previousUrl);
      unclaimedPhotoUrl.current = nextUrl;
    }
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  function handleCredentialsNext() {
    const message = validateCredentials(credentials);
    setCredentialsError(message);
    if (message === null) setStep(2);
  }

  function handleProfileNext() {
    if (signUpMutation.isPending) return;
    const message = validateProfile(profile);
    setProfileError(message);
    if (message !== null) return;
    signUpMutation.mutate(
      {
        loginId: credentials.loginId,
        password: credentials.password,
        nickname: profile.nickname,
        email: profile.email,
        profileImageUrl: profile.profileImageUrl,
        preferredCategory: profile.preferredCategory,
      },
      {
        onSuccess: () => {
          // 사진의 주소는 이제 가입한 계정이 쓴다. 이 화면이 해제하지 않는다.
          unclaimedPhotoUrl.current = null;
          setStep(3);
        },
        onError: (error) => {
          if (error instanceof ApiError && error.code === 'DUPLICATED_LOGIN_ID') {
            setCredentialsError(SIGN_UP_MESSAGES.loginIdDuplicated);
            setStep(1);
          }
        },
      },
    );
  }

  return (
    <div className="pb-[96px]">
      <StepIndicator currentStep={step} />
      {step === 1 && (
        <CredentialsStep
          values={credentials}
          onChange={(field, value) => setCredentials((prev) => ({ ...prev, [field]: value }))}
          errorMessage={credentialsError}
          onCancel={() => router.push('/login')}
          onNext={handleCredentialsNext}
        />
      )}
      {step === 2 && (
        <ProfileStep
          values={profile}
          onChange={handleProfileChange}
          errorMessage={profileError}
          onPrevious={() => setStep(1)}
          onNext={handleProfileNext}
        />
      )}
      {step === 3 && <CompleteStep />}
    </div>
  );
}
