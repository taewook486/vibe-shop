/**
 * P7-T7.7: 사용자 쿠폰 API - 쿠폰 적용
 *
 * - POST: 쿠폰 적용 (주문에 쿠폰 사용 기록)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * POST /api/coupons/apply - 쿠폰 적용
 *
 * 주의: 이 API는 주문 생성 시 호출되며, coupon_usages 테이블에 기록합니다.
 * 실제 사용은 주문 완료 후 트리거에 의해 자동으로 처리됩니다.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // 1. 인증 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. 요청 데이터 파싱
    const body = await request.json();
    const { coupon_id, order_id, discount_amount } = body;

    if (!coupon_id || !order_id || discount_amount === undefined) {
      return NextResponse.json(
        {
          error:
            'Invalid request: coupon_id, order_id, and discount_amount required',
        },
        { status: 400 }
      );
    }

    // 3. 쿠폰 사용 기록 생성
    // 트리거가 자동으로:
    // - coupons.used_count 증가
    // - user_coupons.is_used = true, used_at 설정
    const { data: usage, error } = await supabase
      .from('coupon_usages')
      .insert({
        coupon_id,
        user_id: user.id,
        order_id,
        discount_amount,
      })
      .select()
      .single();

    if (error) {
      console.error('쿠폰 적용 에러:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Coupon applied successfully',
      usage,
    });
  } catch (error) {
    console.error('쿠폰 적용 에러:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
