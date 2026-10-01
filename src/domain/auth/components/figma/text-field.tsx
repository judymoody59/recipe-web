import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

import { FigmaTintedAsset, type FigmaAssetName } from './figma-asset';

type FigmaFieldFrameProps = {
  icon: FigmaAssetName;
  // 값이 들어 있으면 아이콘이 글자와 같은 색이 된다.
  filled: boolean;
  children: ReactNode;
};

// 입력칸의 겉 틀. 안에 넣는 입력 요소는 `figmaFieldControlClassName` 으로 틀 전체를 덮는다.
export function FigmaFieldFrame({ icon, filled, children }: FigmaFieldFrameProps) {
  return (
    <div className={cn('relative h-120 w-601', filled ? 'text-[#292d32]' : 'text-[#ababab]')}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[calc(var(--spacing)*8)] border-[length:calc(var(--spacing)*1.8)] border-[rgba(41,45,50,0.5)] bg-white shadow-[inset_0_0_calc(var(--spacing)*8)_rgba(0,0,0,0.25)]"
      />
      <FigmaTintedAsset
        name={icon}
        className="pointer-events-none absolute top-32 left-38 size-55"
      />
      {children}
    </div>
  );
}

// 글자는 틀 왼쪽에서 131 떨어진 곳에서 시작한다.
export const figmaFieldControlClassName =
  'absolute inset-0 size-full rounded-[calc(var(--spacing)*8)] bg-transparent pr-24 pl-131 text-[length:calc(var(--spacing)*28)] font-medium text-[#292d32] outline-none placeholder:text-[#ababab] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#292d32]';

type FigmaTextFieldProps = {
  icon: FigmaAssetName;
  placeholder: string;
  type?: 'text' | 'password';
  value: string;
  onChange: (value: string) => void;
};

export function FigmaTextField({
  icon,
  placeholder,
  type = 'text',
  value,
  onChange,
}: FigmaTextFieldProps) {
  return (
    <FigmaFieldFrame icon={icon} filled={value !== ''}>
      <input
        type={type}
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={figmaFieldControlClassName}
      />
    </FigmaFieldFrame>
  );
}
