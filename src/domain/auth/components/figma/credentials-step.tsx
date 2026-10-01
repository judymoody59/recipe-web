import type { CredentialsInput } from '../../utils/sign-up-validation';
import { FigmaErrorMessage } from './error-message';
import { FigmaStepActions } from './step-actions';
import { FigmaTextField } from './text-field';

type FigmaCredentialsStepProps = {
  values: CredentialsInput;
  onChange: (field: keyof CredentialsInput, value: string) => void;
  errorMessage: string | null;
  onCancel: () => void;
  onNext: () => void;
};

export function FigmaCredentialsStep({
  values,
  onChange,
  errorMessage,
  onCancel,
  onNext,
}: FigmaCredentialsStepProps) {
  return (
    <>
      <div className="absolute top-245 left-660 flex flex-col gap-30">
        <FigmaTextField
          icon="person"
          placeholder="아이디"
          value={values.loginId}
          onChange={(value) => onChange('loginId', value)}
        />
        <FigmaTextField
          icon="encrypted"
          placeholder="비밀번호"
          type="password"
          value={values.password}
          onChange={(value) => onChange('password', value)}
        />
        <FigmaTextField
          icon="encrypted"
          placeholder="비밀번호 확인"
          type="password"
          value={values.passwordConfirm}
          onChange={(value) => onChange('passwordConfirm', value)}
        />
      </div>
      {/* 오류 상태는 피그마에 없다. 입력칸 묶음과 버튼 줄 사이의 가운데에 둔다. */}
      {errorMessage !== null && (
        <div className="absolute inset-x-0 top-682">
          <FigmaErrorMessage lines={[errorMessage]} />
        </div>
      )}
      <FigmaStepActions leftLabel="취소" onLeftClick={onCancel} onNextClick={onNext} />
    </>
  );
}
