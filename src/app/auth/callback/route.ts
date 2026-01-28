/**
 * Auth Callback Route
 *
 * Supabase 매직 링크/OAuth 콜백 처리
 * URL: /auth/callback
 */

import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 성공적으로 로그인된 경우 리다이렉트
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // 에러 발생 시 로그인 페이지로 리다이렉트
  return NextResponse.redirect(new URL('/login?error=auth_callback_error', requestUrl.origin));
}
