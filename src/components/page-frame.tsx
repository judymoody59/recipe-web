import type { ReactNode } from 'react';

import { TopBar } from './top-bar';

// 내용은 고정 폭이고 가로 중심이 언제나 창의 가로 중심에 놓인다.
// 창이 내용보다 좁으면 양쪽으로 같은 만큼 넘친다.
export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <main className="ml-[calc(50%-718px)] w-[1436px]">{children}</main>
    </div>
  );
}
