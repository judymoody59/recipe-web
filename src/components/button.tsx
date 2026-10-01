import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';

export type ButtonVariant = 'muted' | 'primary' | 'outline' | 'subtle';

const variantClassNames: Record<ButtonVariant, string> = {
  muted: 'bg-[#B0B0B0] font-semibold text-white',
  primary: 'bg-[#292D32] font-semibold text-white',
  outline: 'border border-[#B0B0B0] bg-white font-semibold text-[#B0B0B0]',
  subtle: 'border border-[#797979] bg-[#EEEEEE] font-normal text-black',
};

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant: ButtonVariant;
};

// 양 끝이 반원인 버튼. 크기는 쓰는 쪽이 `className` 으로 정한다.
export function Button({ variant, type = 'button', className, ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'box-border inline-flex items-center justify-center rounded-full text-[36px] leading-none enabled:cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#292D32]',
        variantClassNames[variant],
        className,
      )}
      {...props}
    />
  );
}
