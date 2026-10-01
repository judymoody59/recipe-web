'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
        onSuccess: () => setStep(3),
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
          onChange={(field, value) => setProfile((prev) => ({ ...prev, [field]: value }))}
          errorMessage={profileError}
          onPrevious={() => setStep(1)}
          onNext={handleProfileNext}
        />
      )}
      {step === 3 && <CompleteStep />}
    </div>
  );
}
