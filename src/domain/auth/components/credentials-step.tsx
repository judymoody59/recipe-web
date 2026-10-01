import { PersonIcon } from '@/components/icons/person-icon';
import { ShieldIcon } from '@/components/icons/shield-icon';
import { TextField } from '@/components/text-field';

import type { CredentialsInput } from '../utils/sign-up-validation';
import { ErrorMessage } from './error-message';
import { StepActions } from './step-actions';

type CredentialsStepProps = {
  values: CredentialsInput;
  onChange: (field: keyof CredentialsInput, value: string) => void;
  errorMessage: string | null;
  onCancel: () => void;
  onNext: () => void;
};

export function CredentialsStep({
  values,
  onChange,
  errorMessage,
  onCancel,
  onNext,
}: CredentialsStepProps) {
  return (
    <div>
      <div className="relative h-[581px] w-[1436px]">
        <div className="absolute top-[95px] left-[418px] flex flex-col gap-[30px]">
          <TextField
            icon={<PersonIcon />}
            placeholder="아이디"
            value={values.loginId}
            onChange={(value) => onChange('loginId', value)}
          />
          <TextField
            icon={<ShieldIcon />}
            placeholder="비밀번호"
            type="password"
            value={values.password}
            onChange={(value) => onChange('password', value)}
          />
          <TextField
            icon={<ShieldIcon />}
            placeholder="비밀번호 확인"
            type="password"
            value={values.passwordConfirm}
            onChange={(value) => onChange('passwordConfirm', value)}
          />
        </div>
        {errorMessage !== null && (
          <div className="absolute inset-x-0 top-[532px]">
            <ErrorMessage lines={[errorMessage]} />
          </div>
        )}
      </div>
      <StepActions leftLabel="취소" onLeftClick={onCancel} onNextClick={onNext} />
    </div>
  );
}
