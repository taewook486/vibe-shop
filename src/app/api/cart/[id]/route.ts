/**
 * Cart Item API Route
 *
 * PATCH /api/cart/[id] - 수량 변경
 * DELETE /api/cart/[id] - 장바구니 아이템 삭제
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { cookies } from 'next/headers';

// ============================================================================
// Validation Schemas
// ============================================================================

const updateQuantitySchema = z.object({
  quantity: z.number().int().positive('수량은 1개 이상이어야 합니다.'),
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 비회원 세션 ID 가져오기
 */
async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('cart_session')?.value || null;
}

/**
 * 장바구니 아이템 소유권 확인
 */
async function verifyCartItemOwnership(
  supabase: any,
  cartItemId: string,
  userId: string | null,
  sessionId: string | null
): Promise<{ success: boolean; item?: any }> {
  let query = supabase.from('cart_items').select('*').eq('id', cartItemId);

  if (userId) {
    query = query.eq('user_id', userId);
  } else if (sessionId) {
    query = query.eq('session_id', sessionId);
  } else {
    return { success: false };
  }

  const { data: item, error } = await query.single();

  if (error || !item) {
    return { success: false };
  }

  return { success: true, item };
}

// ============================================================================
// PATCH /api/cart/[id] - 수량 변경
// ============================================================================

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cartItemId } = await params;

    // 요청 본문 파싱
    const body = await request.json();

    // 유효성 검증
    const validation = updateQuantitySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: '잘못된 요청입니다.',
            details: validation.error.issues,
          },
        },
        { status: 400 }
      );
    }

    const { quantity } = validation.data;

    // NextAuth 세션 확인
    const session = await auth();
    const userId = session?.user?.id;

    const sessionId = await getSessionId();

    const supabase = createAdminClient();

    // 장바구니 아이템 소유권 확인
    const ownership = await verifyCartItemOwnership(
      supabase,
      cartItemId,
      userId || null,
      sessionId
    );

    if (!ownership.success) {
      return NextResponse.json(
        {
          error: {
            code: 'CART_ITEM_NOT_FOUND',
            message: '장바구니 아이템을 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    // 수량 업데이트
    const { data: updatedItem, error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .select()
      .single();

    if (updateError) {
      console.error('수량 업데이트 실패:', updateError);
      return NextResponse.json(
        {
          error: {
            code: 'UPDATE_ERROR',
            message: '수량 변경에 실패했습니다.',
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: updatedItem,
        message: '수량이 변경되었습니다.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('수량 변경 중 예외 발생:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: '서버 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE /api/cart/[id] - 장바구니 아이템 삭제
// ============================================================================

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cartItemId } = await params;

    // NextAuth 세션 확인
    const session = await auth();
    const userId = session?.user?.id;

    const sessionId = await getSessionId();

    const supabase = createAdminClient();

    // 장바구니 아이템 소유권 확인
    const ownership = await verifyCartItemOwnership(
      supabase,
      cartItemId,
      userId || null,
      sessionId
    );

    if (!ownership.success) {
      return NextResponse.json(
        {
          error: {
            code: 'CART_ITEM_NOT_FOUND',
            message: '장바구니 아이템을 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    // 삭제
    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (deleteError) {
      console.error('장바구니 아이템 삭제 실패:', deleteError);
      return NextResponse.json(
        {
          error: {
            code: 'DELETE_ERROR',
            message: '장바구니 아이템 삭제에 실패했습니다.',
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: '장바구니 아이템이 삭제되었습니다.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('장바구니 아이템 삭제 중 예외 발생:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: '서버 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}
