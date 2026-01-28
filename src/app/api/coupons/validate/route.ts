/**
 * P7-T7.7: 사용자 쿠폰 API - 쿠폰 검증
 *
 * - POST: 쿠폰 코드 검증 및 할인 금액 계산
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * POST /api/coupons/validate - 쿠폰 코드 검증
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
    const { code, order_amount } = body;

    if (!code || order_amount === undefined) {
      return NextResponse.json(
        { error: 'Invalid request: code and order_amount required' },
        { status: 400 }
      );
    }

    // 3. 쿠폰 검증 함수 호출
    const { data, error } = await supabase.rpc('validate_coupon', {
      p_coupon_code: code,
      p_user_id: user.id,
      p_order_amount: order_amount,
    });

    if (error) {
      console.error('쿠폰 검증 에러:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 4. 검증 결과 반환
    if (!data || data.length === 0) {
      return NextResponse.json({
        is_valid: false,
        error_message: '쿠폰 검증에 실패했습니다.',
        discount_amount: 0,
      });
    }

    const result = data[0];

    return NextResponse.json({
      is_valid: result.is_valid,
      error_message: result.error_message,
      discount_amount: result.discount_amount || 0,
      coupon_id: result.coupon_id,
    });
  } catch (error) {
    console.error('쿠폰 검증 에러:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
