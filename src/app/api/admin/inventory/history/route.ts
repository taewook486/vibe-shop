/**
 * P7-T7.11: Admin Inventory History API Route
 *
 * GET /api/admin/inventory/history - 재고 변경 이력 조회
 *
 * Query Parameters:
 * - product_id: 상품 ID로 필터링
 * - type: 변경 타입 (in/out/adjust)
 * - reference_type: 참조 타입 (order/manual/return/damage)
 * - start_date: 시작 날짜
 * - end_date: 종료 날짜
 * - page: 페이지 번호
 * - limit: 페이지당 항목 수
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // 관리자 권한 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
    }

    // 쿼리 파라미터 파싱
    const searchParams = request.nextUrl.searchParams;
    const product_id = searchParams.get('product_id');
    const type = searchParams.get('type');
    const reference_type = searchParams.get('reference_type');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // 재고 이력 조회
    let query = supabase
      .from('inventory_logs')
      .select(
        `
        *,
        product:products(id, name, slug, stock),
        creator:profiles!inventory_logs_created_by_fkey(id, email)
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false });

    // 필터 적용
    if (product_id) {
      query = query.eq('product_id', product_id);
    }

    if (type && ['in', 'out', 'adjust'].includes(type)) {
      query = query.eq('type', type as 'in' | 'out' | 'adjust');
    }

    if (reference_type) {
      query = query.eq('reference_type', reference_type);
    }

    if (start_date) {
      query = query.gte('created_at', start_date);
    }

    if (end_date) {
      query = query.lte('created_at', end_date);
    }

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: logs, error, count } = await query;

    if (error) {
      console.error('재고 이력 조회 오류:', error);
      return NextResponse.json(
        { error: '재고 이력 조회 실패' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: logs || [],
      meta: {
        total: count || 0,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('재고 이력 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
