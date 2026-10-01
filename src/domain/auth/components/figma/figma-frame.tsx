import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type FigmaFrameProps = {
  className?: string;
  children: ReactNode;
};

// 이 틀 안에서 간격 단위 1 은 피그마의 1px 이다. 틀이 1920px 보다 좁으면 그 폭에 비례해
// 줄어들고, 넓으면 1px 에서 멈춘 채 내용이 가로 가운데에 놓인다.
export function FigmaFrame({ className, children }: FigmaFrameProps) {
  return (
    <div
      className={cn(
        '@container min-h-screen bg-white [--spacing:min(1px,calc(100cqw/1920))]',
        className,
      )}
    >
      <header className="relative h-150 bg-white shadow-[0_calc(var(--spacing)*4)_calc(var(--spacing)*40)_0_rgba(0,0,0,0.1)]">
        <div className="absolute top-46 left-1/2 flex h-58 w-180 -translate-x-1/2 items-center justify-center rounded-[calc(var(--spacing)*8)] bg-[#f4f4f4] text-[length:calc(var(--spacing)*20)] leading-25 font-semibold text-[#ababab]">
          로고
        </div>
      </header>
      <main className="relative mx-auto w-1920">{children}</main>
    </div>
  );
}
