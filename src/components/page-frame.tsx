import type { ReactNode } from 'react';

import { TopBar } from './top-bar';

// 내용은 창 폭과 관계없이 고정 폭으로 가로 가운데에 놓인다.
export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen min-w-[1436px] bg-white">
      <TopBar />
      <main className="mx-auto w-[1436px]">{children}</main>
    </div>
  );
}
