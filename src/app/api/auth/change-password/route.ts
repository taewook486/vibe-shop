/**
 * Change Password API Route
 *
 * NextAuth.js 세션 사용자의 비밀번호 변경
 * - Supabase Admin API로 비밀번호 업데이트
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // 1. 세션 확인
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    // 2. 요청 본문 파싱
    const { newPassword } = await request.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 최소 6자 이상이어야 합니다' },
        { status: 400 }
      );
    }

    // 3. Supabase Admin Client로 비밀번호 변경
    const supabase = createAdminClient();

    const { error } = await supabase.auth.admin.updateUserById(
      session.user.id,
      { password: newPassword }
    );

    if (error) {
      console.error('Password change error:', error);
      return NextResponse.json(
        { error: '비밀번호 변경에 실패했습니다' },
        { status: 500 }
      );
    }

    // 4. 성공 응답
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Change password API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
