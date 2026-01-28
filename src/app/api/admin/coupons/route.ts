/**
 * P7-T7.7: 쿠폰 관리 API - CRUD
 *
 * - POST: 쿠폰 생성
 * - GET: 쿠폰 목록 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * POST /api/admin/coupons - 쿠폰 생성
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
    const {
      code,
      name,
      type,
      value,
      min_order_amount = 0,
      max_discount,
      start_at,
      end_at,
      usage_limit,
      usage_limit_per_user = 1,
      is_active = true,
    } = body;

    // 3. 쿠폰 코드 생성 (없으면 자동 생성)
    let couponCode = code;
    if (!couponCode) {
      const { data: generatedCode } = await supabase.rpc('generate_coupon_code', {
        length: 10,
      });
      couponCode = generatedCode;
    }

    // 4. 쿠폰 생성
    const { data: coupon, error } = await supabase
      .from('coupons')
      .insert({
        code: couponCode,
        name,
        type,
        value,
        min_order_amount,
        max_discount,
        start_at,
        end_at,
        usage_limit,
        usage_limit_per_user,
        is_active,
      })
      .select()
      .single();

    if (error) {
      console.error('쿠폰 생성 에러:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    console.error('쿠폰 생성 에러:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/coupons - 쿠폰 목록 조회
 */
export async function GET(request: NextRequest) {
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

    // 2. 쿼리 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('is_active');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // 3. 쿠폰 목록 조회
    let query = supabase
      .from('coupons')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // 필터 적용
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }

    if (type) {
      query = query.eq('type', type as 'percent' | 'fixed' | 'free_shipping');
    }

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: coupons, error, count } = await query;

    if (error) {
      console.error('쿠폰 목록 조회 에러:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      coupons,
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('쿠폰 목록 조회 에러:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
