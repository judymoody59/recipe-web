import { Inter } from 'next/font/google';

import { FigmaFrame } from '@/domain/auth/components/figma/figma-frame';

// Inter 에는 한글이 없다. 한글은 뒤에 적은 시스템 글꼴로 그려진다.
const inter = Inter({
  subsets: ['latin'],
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

export default function FigmaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <FigmaFrame className={inter.className}>{children}</FigmaFrame>;
}
