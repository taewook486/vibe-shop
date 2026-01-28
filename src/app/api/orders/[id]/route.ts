/**
 * Orders Detail API Route
 * GET /api/orders/[id] - 주문 상세 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/orders/[id] - 주문 상세 조회
 * - 본인 주문만 조회 가능 (RLS)
 * - 주문 상품 포함
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const supabase = await createServerClient();
    const { id } = await context.params;

    // 1. 사용자 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: '로그인이 필요합니다',
          },
        },
        { status: 401 }
      );
    }

    // 2. 주문 상세 조회 (RLS가 자동으로 본인 검증)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(
        `
        *,
        order_items (*)
      `
      )
      .eq('id', id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: '주문을 찾을 수 없습니다',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: order,
    });
  } catch (error) {
    console.error('주문 상세 조회 에러:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: '주문 상세 조회 중 오류가 발생했습니다',
        },
      },
      { status: 500 }
    );
  }
}
