import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';

type FigmaButtonVariant = 'muted' | 'primary' | 'outline' | 'subtle';

const variantClassNames: Record<FigmaButtonVariant, string> = {
  muted: 'bg-[#b0b0b0] font-semibold text-white',
  primary: 'bg-[#292d32] font-semibold text-white',
  outline: 'border-[length:var(--spacing)] border-[#b0b0b0] bg-white font-semibold text-[#b0b0b0]',
  subtle: 'border-[length:var(--spacing)] border-[#797979] bg-[#eee] font-medium text-black',
};

type FigmaButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant: FigmaButtonVariant;
};

// 크기와 모서리는 쓰는 쪽이 `className` 으로 정한다.
export function FigmaButton({ variant, type = 'button', className, ...props }: FigmaButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center text-[length:calc(var(--spacing)*36)] leading-25 enabled:cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#292d32]',
        variantClassNames[variant],
        className,
      )}
      {...props}
    />
  );
}
