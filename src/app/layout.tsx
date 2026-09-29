import type { Metadata } from 'next';

import { QueryProvider } from '@/global/providers/query-provider';

import './globals.css';

export const metadata: Metadata = {
  title: 'recipe-web',
  description: '레시피 공유 웹 서비스',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
