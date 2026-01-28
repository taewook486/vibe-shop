/**
 * P7-T7.7: 사용자 쿠폰 API - 기본 라우트
 *
 * - GET: 사용 가능한 활성 쿠폰 목록 조회 (공개)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * GET /api/coupons - 활성 쿠폰 목록 조회 (공개)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // 1. 현재 사용 가능한 활성 쿠폰 조회
    const { data: coupons, error } = await supabase
      .from('coupons')
      .select('id, code, name, type, value, min_order_amount, max_discount, end_at')
      .eq('is_active', true)
      .lte('start_at', new Date().toISOString())
      .gte('end_at', new Date().toISOString())
      .order('created_at', { ascending: false });

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
