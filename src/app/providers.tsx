/**
 * App Providers
 *
 * NextAuth SessionProvider를 포함한 모든 클라이언트 Provider를 관리합니다.
 * - SessionProvider: 모든 클라이언트 컴포넌트에서 useSession() 사용 가능
 * - Toaster: 전역 toast 알림 (sonner)
 */

'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster position="top-right" richColors />
    </SessionProvider>
  );
}
