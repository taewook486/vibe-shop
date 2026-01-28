/**
 * Admin Orders API Route
 *
 * GET /api/admin/orders - 주문 목록 조회
 * NextAuth 인증 사용
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import type { OrderStatus } from '@/types/order';

export async function GET(request: NextRequest) {
  try {
    // NextAuth 세션 확인
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
    }

    const supabase = await createServerClient();

    // 쿼리 파라미터
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as OrderStatus | null;
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // 주문 목록 조회
    let query = supabase
      .from('orders')
      .select(
        `
        *,
        order_items (
          *
        )
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false });

    // 상태 필터
    if (status && (status as string) !== 'all') {
      query = query.eq('status', status);
    }

    // 주문번호 검색
    if (search) {
      query = query.ilike('order_number', `%${search}%`);
    }

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: orders, error, count } = await query;

    if (error) {
      console.error('주문 목록 조회 오류:', error);
      return NextResponse.json(
        { error: '주문 목록 조회 실패' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: orders || [],
      meta: {
        total: count || 0,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('주문 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
