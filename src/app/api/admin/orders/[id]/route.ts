/**
 * Admin Order Detail API Route
 *
 * GET /api/admin/orders/[id] - 주문 상세 조회
 * PATCH /api/admin/orders/[id] - 주문 상태 변경
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    // 주문 상세 조회
    const { data: order, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        order_items (
          *
        )
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      console.error('주문 상세 조회 오류:', error);
      return NextResponse.json(
        { error: '주문을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: order });
  } catch (error) {
    console.error('주문 상세 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    // 요청 본문 파싱
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: '상태는 필수입니다' },
        { status: 400 }
      );
    }

    // 주문 상태 변경
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(
        `
        *,
        order_items (
          *
        )
      `
      )
      .single();

    if (error) {
      console.error('주문 상태 변경 오류:', error);
      return NextResponse.json(
        { error: '주문 상태 변경 실패' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: order });
  } catch (error) {
    console.error('주문 상태 변경 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
