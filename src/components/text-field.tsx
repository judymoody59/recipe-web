import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type TextFieldFrameProps = {
  icon: ReactNode;
  // 값이 들어 있으면 아이콘이 글자와 같은 색이 된다.
  filled: boolean;
  className?: string;
  children: ReactNode;
};

// 입력칸의 겉 틀. 안에 넣는 입력 요소는 `textFieldControlClassName` 으로 틀 전체를 덮는다.
export function TextFieldFrame({ icon, filled, className, children }: TextFieldFrameProps) {
  return (
    <div
      className={cn(
        'relative box-border h-[120px] w-[600px] rounded-[6px] border-2 border-[#87898C] bg-white shadow-[inset_0_0_6px_rgba(0,0,0,0.12)]',
        filled ? 'text-[#292D32]' : 'text-[#ABABAB]',
        className,
      )}
    >
      <span className="pointer-events-none absolute top-1/2 left-[63.5px] flex -translate-x-1/2 -translate-y-1/2">
        {icon}
      </span>
      {children}
    </div>
  );
}

// 테두리까지 덮어 틀과 같은 크기가 되고, 글자는 틀 왼쪽에서 132px 떨어진 곳에서 시작한다.
export const textFieldControlClassName =
  'absolute -inset-[2px] rounded-[6px] bg-transparent pr-[24px] pl-[132px] text-[28px] font-medium text-[#292D32] outline-none placeholder:text-[#ABABAB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#292D32]';

type TextFieldProps = {
  icon: ReactNode;
  placeholder: string;
  type?: 'text' | 'password';
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function TextField({
  icon,
  placeholder,
  type = 'text',
  value,
  onChange,
  className,
}: TextFieldProps) {
  return (
    <TextFieldFrame icon={icon} filled={value !== ''} className={className}>
      <input
        type={type}
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={textFieldControlClassName}
      />
    </TextFieldFrame>
  );
}
