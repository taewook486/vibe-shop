/**
 * P7-T7.7: 쿠폰 발급 API
 *
 * - POST: 쿠폰 발급 (특정 사용자/대량 발급)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * POST /api/admin/coupons/issue - 쿠폰 발급
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // 1. 관리자 권한 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. 요청 데이터 파싱
    const body = await request.json();
    const { coupon_id, user_ids, expires_days = 30 } = body;

    if (!coupon_id || !user_ids || !Array.isArray(user_ids)) {
      return NextResponse.json(
        { error: 'Invalid request: coupon_id and user_ids required' },
        { status: 400 }
      );
    }

    // 3. 쿠폰 존재 확인
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('id', coupon_id)
      .single();

    if (couponError || !coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    // 4. 만료일 계산
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expires_days);

    // 5. 사용자별 쿠폰 발급
    const userCouponsToInsert = user_ids.map((userId) => ({
      user_id: userId,
      coupon_id,
      expires_at: expiresAt.toISOString(),
    }));

    const { data: issuedCoupons, error: issueError } = await supabase
      .from('user_coupons')
      .insert(userCouponsToInsert)
      .select();

    if (issueError) {
      console.error('쿠폰 발급 에러:', issueError);
      return NextResponse.json({ error: issueError.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Coupons issued successfully',
      issued_count: issuedCoupons?.length || 0,
      coupons: issuedCoupons,
    });
  } catch (error) {
    console.error('쿠폰 발급 에러:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
