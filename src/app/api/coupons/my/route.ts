/**
 * P7-T7.7: 사용자 쿠폰 API - 내 쿠폰 목록
 *
 * - GET: 내 쿠폰 목록 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * GET /api/coupons/my - 내 쿠폰 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    // 1. NextAuth 세션 확인
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    // 2. 쿼리 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const isUsed = searchParams.get('is_used');
    const isExpired = searchParams.get('is_expired');

    // 3. 내 쿠폰 목록 조회 (쿠폰 정보 포함)
    let query = supabase
      .from('user_coupons')
      .select(
        `
        *,
        coupon:coupons (
          id,
          code,
          name,
          type,
          value,
          min_order_amount,
          max_discount,
          start_at,
          end_at
        )
      `
      )
      .eq('user_id', userId)
      .order('issued_at', { ascending: false });

    // 필터 적용
    if (isUsed !== null) {
      query = query.eq('is_used', isUsed === 'true');
    }

    if (isExpired === 'false') {
      query = query.gt('expires_at', new Date().toISOString());
    } else if (isExpired === 'true') {
      query = query.lt('expires_at', new Date().toISOString());
    }

    const { data: coupons, error } = await query;

    if (error) {
      console.error('쿠폰 목록 조회 에러:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error('쿠폰 목록 조회 에러:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
