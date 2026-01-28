/**
 * Next.js Middleware - NextAuth.js v5
 *
 * 역할:
 * - NextAuth 세션 기반 인증 체크
 * - 보호된 라우트 인증 체크 (/my/*)
 * - 관리자 라우트 권한 체크 (/admin/*)
 */

import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * NextAuth.js 미들웨어
 *
 * auth() 함수는 현재 세션을 반환하며, req 객체에 세션 정보가 포함됨
 */
export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const { pathname } = nextUrl;

  // 안전한 로그인 상태 확인
  const isLoggedIn = !!session?.user?.id;
  const isAdmin = session?.user?.role === 'admin';

  // 1. 보호된 라우트 체크 (/my/*)
  if (pathname.startsWith('/my') && !isLoggedIn) {
    const redirectUrl = new URL('/auth/login', nextUrl);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. 관리자 라우트 체크 (/admin/*)
  if (pathname.startsWith('/admin')) {
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    if (!isLoggedIn) {
      const redirectUrl = new URL('/auth/login', nextUrl);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // 관리자가 아닌 경우 홈으로 리다이렉트
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
  }

  // 3. 통과 - 다음 미들웨어 또는 라우트 핸들러로
  return NextResponse.next();
});

/**
 * 미들웨어 적용 대상 설정
 *
 * - API 라우트는 별도 처리 (NextAuth API 제외)
 * - 정적 파일 제외
 * - Next.js 내부 파일 제외
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handled separately in API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};
