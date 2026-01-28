/**
 * Orders Payment API Route
 * PATCH /api/orders/[id]/payment - 결제 승인 및 상태 업데이트
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { approvePayment } from '@/lib/toss/payments';
import { UpdatePaymentRequestSchema } from '@/types/order';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * PATCH /api/orders/[id]/payment - 결제 승인 및 상태 업데이트
 * - Toss Payments 결제 승인 호출 (또는 가상 결제)
 * - 성공 시 status='paid', paid_at 설정
 * - 다운로드 권한 자동 생성 (트리거)
 * - 회원/비회원 모두 결제 가능
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const supabase = await createServerClient();
    const { id } = await context.params;

    // 1. 요청 데이터 검증 (인증은 주문 조회 단계에서 RLS로 처리)
    const body = await request.json();
    const validation = UpdatePaymentRequestSchema.safeParse(body);

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

    const { paymentKey, orderId, amount } = validation.data;

    // 2. 주문 조회
    // RLS 정책에 의해 회원은 본인 주문만, 비회원은 주문 ID만으로 접근 가능
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
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

    // 3. 이미 결제된 주문 확인
    if (order.status !== 'pending') {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_STATUS',
            message: '이미 처리된 주문입니다',
          },
        },
        { status: 400 }
      );
    }

    // 4. 금액 일치 확인
    if (order.total_amount !== amount) {
      return NextResponse.json(
        {
          error: {
            code: 'AMOUNT_MISMATCH',
            message: '결제 금액이 일치하지 않습니다',
          },
        },
        { status: 400 }
      );
    }

    // 5. 주문번호 일치 확인
    if (order.order_number !== orderId) {
      return NextResponse.json(
        {
          error: {
            code: 'ORDER_MISMATCH',
            message: '주문번호가 일치하지 않습니다',
          },
        },
        { status: 400 }
      );
    }

    // 6. Mock 결제 또는 Toss Payments 결제 승인
    let paymentInfo: Record<string, any>;

    if (paymentKey.startsWith('mock_')) {
      // 가상 결제: Toss API 호출 건너뛰기
      paymentInfo = {
        paymentKey,
        orderId,
        method: 'MOCK',
        approvedAt: new Date().toISOString(),
        isMock: true,
      };
    } else {
      // 실제 Toss Payments 결제 승인
      try {
        const tossResponse = await approvePayment({
          paymentKey,
          orderId,
          amount,
        });
        paymentInfo = {
          paymentKey: tossResponse.paymentKey,
          orderId: tossResponse.orderId,
          method: tossResponse.method,
          approvedAt: tossResponse.approvedAt,
        };
      } catch (tossError) {
        console.error('Toss 결제 승인 실패:', tossError);
        return NextResponse.json(
          {
            error: {
              code: 'PAYMENT_FAILED',
              message:
                tossError instanceof Error
                  ? tossError.message
                  : '결제 승인에 실패했습니다',
            },
          },
          { status: 400 }
        );
      }
    }

    // 7. 주문 상태 업데이트 (pending → paid)
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        payment_info: paymentInfo,
      })
      .eq('id', id)
      .select(
        `
        *,
        order_items (*)
      `
      )
      .single();

    if (updateError) {
      console.error('주문 상태 업데이트 실패:', updateError);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: '주문 상태 업데이트에 실패했습니다',
          },
        },
        { status: 500 }
      );
    }

    // 8. 다운로드 권한은 트리거에서 자동 생성됨

    return NextResponse.json({
      data: updatedOrder,
    });
  } catch (error) {
    console.error('결제 승인 에러:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: '결제 승인 중 오류가 발생했습니다',
        },
      },
      { status: 500 }
    );
  }
}
