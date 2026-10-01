import { cn } from '@/lib/cn';

import type { SignUpStep } from '../step-indicator';
import { FigmaAsset } from './figma-asset';

const STEPS: { step: SignUpStep; label: string; className: string }[] = [
  { step: 1, label: '아이디/비밀번호 설정', className: 'left-0' },
  { step: 2, label: '프로필 설정', className: 'left-582' },
  { step: 3, label: '회원가입 완료', className: 'left-1163' },
];

// 알약 사이의 꺾쇠. 선의 굵기만큼 자리 밖으로 넘쳐 그려진다.
function Chevron({ className }: { className: string }) {
  return (
    <div className={cn('absolute top-23 h-27 w-13.5', className)}>
      <div className="absolute inset-[-5.56%_-15.71%_-5.56%_-11.11%]">
        <FigmaAsset name="step-chevron" className="size-full" />
      </div>
    </div>
  );
}

type FigmaStepIndicatorProps = {
  currentStep: SignUpStep;
};

export function FigmaStepIndicator({ currentStep }: FigmaStepIndicatorProps) {
  return (
    <div className="absolute top-80 left-242 h-70 w-1436">
      {/* 점선은 알약 뒤로 지나가고, 알약의 흰 바탕이 그 위를 덮는다. */}
      <div className="absolute top-35 left-173 h-0 w-1127">
        <div className="absolute inset-x-[-0.13%] inset-y-[calc(var(--spacing)*-1.5)]">
          <FigmaAsset name="step-line" className="size-full" />
        </div>
      </div>
      <ol aria-label="회원가입 단계">
        {STEPS.map(({ step, label, className }) => {
          const isCurrent = step === currentStep;
          return (
            <li
              key={step}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'absolute top-0 flex h-70 w-273 items-center justify-center rounded-[calc(var(--spacing)*100)] border-[length:calc(var(--spacing)*2)] border-[#b0b0b0] text-[length:calc(var(--spacing)*24)] leading-[1.5] font-bold whitespace-nowrap',
                isCurrent ? 'bg-[#b0b0b0] text-white' : 'bg-white text-[#b0b0b0]',
                className,
              )}
            >
              {label}
            </li>
          );
        })}
      </ol>
      <Chevron className="left-421" />
      <Chevron className="left-1003" />
    </div>
  );
}
