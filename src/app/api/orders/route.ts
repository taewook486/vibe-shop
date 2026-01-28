/**
 * Orders API Route
 * POST /api/orders - 주문 생성
 * GET /api/orders - 주문 목록 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';
import {
  CreateOrderRequestSchema,
  type OrderWithItems,
} from '@/types/order';

/**
 * POST /api/orders - 주문 생성
 * - 회원/비회원 모두 가능
 * - 비회원은 guest_email 필수
 * - 주문번호 자동 생성 (트리거)
 * - 총액 = items의 (price * quantity) 합계 - discount_amount
 */
export async function POST(request: NextRequest) {
  try {
    // 1. NextAuth 세션 확인 (선택)
    const session = await auth();
    const userId = session?.user?.id;

    const supabase = createAdminClient();

    // 2. 요청 데이터 검증
    const body = await request.json();
    const validation = CreateOrderRequestSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues?.[0];
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: firstError?.message || '잘못된 요청입니다',
          },
        },
        { status: 400 }
      );
    }

    const { items, guest_email, discount_amount } = validation.data;

    // 3. 비회원인 경우 이메일 필수
    if (!userId && !guest_email) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: '비회원 주문 시 이메일은 필수입니다',
          },
        },
        { status: 400 }
      );
    }

    // 4. 총액 계산
    const itemsTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total_amount = itemsTotal - (discount_amount || 0);

    if (total_amount < 0) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: '할인 금액이 총액보다 클 수 없습니다',
          },
        },
        { status: 400 }
      );
    }

    // 5. 주문 생성 (트랜잭션)
    const orderData = {
      order_number: '', // 트리거가 자동 생성
      user_id: userId || null,
      guest_email: guest_email || null,
      status: 'pending' as const,
      total_amount,
      discount_amount: discount_amount || 0,
      payment_info: {},
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('주문 생성 실패:', orderError);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: '주문 생성에 실패했습니다',
          },
        },
        { status: 500 }
      );
    }

    // 6. 주문 상품 생성
    const orderItemsData = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      price: item.price,
      quantity: item.quantity,
    }));

    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData)
      .select();

    if (itemsError) {
      console.error('주문 상품 생성 실패:', itemsError);
      // Rollback: 주문 삭제
      await supabase.from('orders').delete().eq('id', order.id);

      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: '주문 상품 생성에 실패했습니다',
          },
        },
        { status: 500 }
      );
    }

    // 7. 주문 + 주문 상품 결합
    const orderWithItems: OrderWithItems = {
      ...order,
      payment_info: order.payment_info as Record<string, any>,
      order_items: orderItems,
    };

    return NextResponse.json(
      { data: orderWithItems },
      { status: 201 }
    );
  } catch (error) {
    console.error('주문 생성 에러:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: '주문 생성 중 오류가 발생했습니다',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders - 주문 목록 조회
 * - 로그인 필수 (회원 전용)
 * - 본인 주문만 조회
 * - 최신순 정렬
 */
export async function GET(request: NextRequest) {
  try {
    // 1. NextAuth 세션 확인 (필수)
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
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

    const supabase = createAdminClient();

    // 2. 본인 주문 조회 (user_id로 필터링)
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(
        `
        *,
        order_items (*)
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('주문 목록 조회 실패:', ordersError);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: '주문 목록 조회에 실패했습니다',
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: orders,
    });
  } catch (error) {
    console.error('주문 목록 조회 에러:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: '주문 목록 조회 중 오류가 발생했습니다',
        },
      },
      { status: 500 }
    );
  }
}
