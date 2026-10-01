import { cn } from '@/lib/cn';

export type SignUpStep = 1 | 2 | 3;

const STEPS: { step: SignUpStep; label: string; className: string }[] = [
  { step: 1, label: '아이디/비밀번호 설정', className: 'left-0' },
  { step: 2, label: '프로필 설정', className: 'left-[582px]' },
  { step: 3, label: '회원가입 완료', className: 'left-[1163px]' },
];

// 알약 사이의 점선과 오른쪽을 가리키는 꺾쇠
function Connector({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 308 70"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="5 7"
      className={cn('absolute top-0 h-[70px] w-[308px]', className)}
    >
      <path d="M5.5 35H306" />
      <path d="m148 21.5 14 14-14 14" />
    </svg>
  );
}

type StepIndicatorProps = {
  currentStep: SignUpStep;
};

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="relative mt-[80px] h-[70px] w-[1436px] text-[#B0B0B0]">
      <Connector className="left-[273px]" />
      <Connector className="left-[855px]" />
      <ol aria-label="회원가입 단계">
        {STEPS.map(({ step, label, className }) => {
          const isCurrent = step === currentStep;
          return (
            <li
              key={step}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'absolute top-0 box-border flex h-[70px] w-[273px] items-center justify-center rounded-full text-[24px] leading-none font-bold',
                isCurrent ? 'bg-[#B0B0B0] text-white' : 'border-2 border-[#B0B0B0] text-[#B0B0B0]',
                className,
              )}
            >
              {label}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
