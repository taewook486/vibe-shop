/**
 * @file src/app/api/admin/users/route.ts
 * @description 관리자 사용자 관리 API - 목록 조회
 * @task P7-T7.2
 *
 * GET /api/admin/users - 회원 목록 조회 (검색, 필터, 페이지네이션)
 *
 * Query Parameters:
 * - search: 이메일/닉네임 검색
 * - grade: 등급 필터 (bronze/silver/gold/vip)
 * - isBlocked: 차단 상태 필터
 * - page: 페이지 번호 (기본: 1)
 * - limit: 페이지 크기 (기본: 20)
 *
 * 권한: 관리자 전용
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, createAdminClient } from '@/lib/supabase/server';
import { checkAdminRole } from '@/lib/middleware/admin';

export async function GET(request: NextRequest) {
  try {
    // 1. 관리자 권한 체크
    const supabase = await createServerClient();
    const { isAdmin, user } = await checkAdminRole(supabase);

    if (!isAdmin || !user) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: '관리자 권한이 필요합니다.',
          },
        },
        { status: 403 }
      );
    }

    // 2. 쿼리 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const grade = searchParams.get('grade') || '';
    const isBlockedParam = searchParams.get('isBlocked');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // 3. Admin 클라이언트로 데이터 조회 (RLS 우회)
    const adminSupabase = createAdminClient();

    let query = adminSupabase
      .from('profiles')
      .select(
        `
        id,
        email,
        nickname,
        avatar_url,
        role,
        grade,
        points,
        total_order_amount,
        is_blocked,
        blocked_reason,
        blocked_at,
        last_login_at,
        created_at,
        updated_at
      `,
        { count: 'exact' }
      );

    // 검색 조건 (이메일 또는 닉네임)
    if (search) {
      query = query.or(`email.ilike.%${search}%,nickname.ilike.%${search}%`);
    }

    // 등급 필터
    const validGrades = ['bronze', 'silver', 'gold', 'vip'] as const;
    if (grade && validGrades.includes(grade as any)) {
      query = query.eq('grade', grade as 'bronze' | 'silver' | 'gold' | 'vip');
    }

    // 차단 상태 필터
    if (isBlockedParam !== null) {
      const isBlocked = isBlockedParam === 'true';
      query = query.eq('is_blocked', isBlocked);
    }

    // 정렬 (최근 가입순)
    query = query.order('created_at', { ascending: false });

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // 4. 실행
    const { data: users, error, count } = await query;

    if (error) {
      console.error('Users list error:', error);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: '회원 목록 조회 중 오류가 발생했습니다.',
            details: error.message,
          },
        },
        { status: 500 }
      );
    }

    // 5. 응답
    return NextResponse.json({
      users: users || [],
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: any) {
    console.error('Users API error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: '잘못된 요청입니다.',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: '서버 오류가 발생했습니다.',
          details: error.message,
        },
      },
      { status: 500 }
    );
  }
}
