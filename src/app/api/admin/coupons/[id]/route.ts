/**
 * P7-T7.8: 쿠폰 관리 API - 개별 조회/수정/삭제
 *
 * GET /api/admin/coupons/[id] - 쿠폰 상세 조회
 * PATCH /api/admin/coupons/[id] - 쿠폰 수정
 * DELETE /api/admin/coupons/[id] - 쿠폰 삭제
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { checkAdminRole } from '@/lib/middleware/admin';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    // 인증 및 권한 체크 (NextAuth)
    const adminCheck = await checkAdminRole();
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: { message: '권한이 없습니다.' } },
        { status: 403 }
      );
    }

    const supabase = await createServerClient();

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !coupon) {
      return NextResponse.json(
        { error: { message: '쿠폰을 찾을 수 없습니다.' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error('GET /api/admin/coupons/[id] error:', error);
    return NextResponse.json(
      { error: { message: '서버 오류가 발생했습니다.' } },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    // 인증 및 권한 체크 (NextAuth)
    const adminCheck = await checkAdminRole();
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: { message: '권한이 없습니다.' } },
        { status: 403 }
      );
    }

    const supabase = await createServerClient();

    const body = await request.json();

    // Check if coupon exists
    const { data: existing } = await supabase
      .from('coupons')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: { message: '쿠폰을 찾을 수 없습니다.' } },
        { status: 404 }
      );
    }

    // Update coupon
    const updateData: any = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.value !== undefined) updateData.value = body.value;
    if (body.min_order_amount !== undefined) updateData.min_order_amount = body.min_order_amount;
    if (body.max_discount !== undefined) updateData.max_discount = body.max_discount;
    if (body.start_at !== undefined) updateData.start_at = body.start_at;
    if (body.end_at !== undefined) updateData.end_at = body.end_at;
    if (body.usage_limit !== undefined) updateData.usage_limit = body.usage_limit;
    if (body.usage_limit_per_user !== undefined) updateData.usage_limit_per_user = body.usage_limit_per_user;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;

    updateData.updated_at = new Date().toISOString();

    const { data: coupon, error } = await supabase
      .from('coupons')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Coupon update error:', error);
      return NextResponse.json(
        { error: { message: '쿠폰 수정 실패' } },
        { status: 500 }
      );
    }

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error('PATCH /api/admin/coupons/[id] error:', error);
    return NextResponse.json(
      { error: { message: '서버 오류가 발생했습니다.' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    // 인증 및 권한 체크 (NextAuth)
    const adminCheck = await checkAdminRole();
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: { message: '권한이 없습니다.' } },
        { status: 403 }
      );
    }

    const supabase = await createServerClient();

    // Check if coupon has been used
    const { data: usages } = await supabase
      .from('coupon_usages')
      .select('id')
      .eq('coupon_id', id)
      .limit(1);

    if (usages && usages.length > 0) {
      return NextResponse.json(
        { error: { message: '이미 사용된 쿠폰은 삭제할 수 없습니다.' } },
        { status: 400 }
      );
    }

    // Delete coupon
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Coupon deletion error:', error);
      return NextResponse.json(
        { error: { message: '쿠폰 삭제 실패' } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/coupons/[id] error:', error);
    return NextResponse.json(
      { error: { message: '서버 오류가 발생했습니다.' } },
      { status: 500 }
    );
  }
}
