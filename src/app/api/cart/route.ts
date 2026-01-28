/**
 * Cart API Route
 *
 * GET /api/cart - 장바구니 조회
 * POST /api/cart - 상품 추가
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';

// ============================================================================
// Validation Schemas
// ============================================================================

// UUID-like format validation (less strict than RFC 4122)
const uuidLikePattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const addToCartSchema = z.object({
  product_id: z.string().regex(uuidLikePattern, '유효한 상품 ID를 입력해주세요.'),
  quantity: z.number().int().positive('수량은 1개 이상이어야 합니다.').default(1),
});

// ============================================================================
// Types
// ============================================================================

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  products: {
    name: string;
    price: number;
    discount_price: number | null;
    thumbnail_url: string;
  };
}

interface CartResponse {
  items: Array<{
    id: string;
    product_id: string;
    quantity: number;
    product: {
      name: string;
      price: number;
      discount_price: number | null;
      thumbnail_url: string;
    };
  }>;
  total: number;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 비회원 세션 ID 가져오기 또는 생성
 */
async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existingSessionId = cookieStore.get('cart_session')?.value;

  if (existingSessionId) {
    return existingSessionId;
  }

  return randomUUID();
}

// ============================================================================
// GET /api/cart - 장바구니 조회
// ============================================================================

export async function GET(request: Request) {
  try {
    // NextAuth 세션 확인
    const session = await auth();
    const userId = session?.user?.id;

    const supabase = createAdminClient();

    let query = supabase
      .from('cart_items')
      .select(
        `
        id,
        product_id,
        quantity,
        products:product_id (
          name,
          price,
          discount_price,
          thumbnail_url:metadata->thumbnail_url
        )
      `
      );

    if (userId) {
      // 회원: user_id로 조회
      query = query.eq('user_id', userId);
    } else {
      // 비회원: session_id로 조회
      const sessionId = await getOrCreateSessionId();
      query = query.eq('session_id', sessionId);
    }

    const { data: cartItems, error } = await query;

    if (error) {
      console.error('장바구니 조회 실패:', error);
      return NextResponse.json(
        {
          error: {
            code: 'FETCH_ERROR',
            message: '장바구니 조회에 실패했습니다.',
          },
        },
        { status: 500 }
      );
    }

    // 응답 형식 변환
    const items = (cartItems || []).map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      product: {
        name: item.products?.name || '',
        price: item.products?.price || 0,
        discount_price: item.products?.discount_price || null,
        thumbnail_url: item.products?.thumbnail_url || '',
      },
    }));

    const total = items.reduce((sum, item) => {
      const price = item.product.discount_price ?? item.product.price;
      return sum + price * item.quantity;
    }, 0);

    const response: CartResponse = {
      items,
      total,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('장바구니 조회 중 예외 발생:', error);
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
// POST /api/cart - 상품 추가
// ============================================================================

export async function POST(request: Request) {
  try {
    // 요청 본문 파싱
    const body = await request.json();

    // 유효성 검증
    const validation = addToCartSchema.safeParse(body);
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

    const { product_id, quantity } = validation.data;

    // NextAuth 세션 확인
    const session = await auth();
    const userId = session?.user?.id;

    const supabase = createAdminClient();

    // 1. 상품 존재 확인
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, price, status')
      .eq('id', product_id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        {
          error: {
            code: 'PRODUCT_NOT_FOUND',
            message: '상품을 찾을 수 없습니다.',
          },
        },
        { status: 400 }
      );
    }

    if (product.status !== 'active') {
      return NextResponse.json(
        {
          error: {
            code: 'PRODUCT_NOT_AVAILABLE',
            message: '현재 구매할 수 없는 상품입니다.',
          },
        },
        { status: 400 }
      );
    }

    // 2. 기존 장바구니 아이템 확인
    let existingItemQuery = supabase
      .from('cart_items')
      .select('*')
      .eq('product_id', product_id);

    let sessionId: string | null = null;

    if (userId) {
      existingItemQuery = existingItemQuery.eq('user_id', userId);
    } else {
      sessionId = await getOrCreateSessionId();
      existingItemQuery = existingItemQuery.eq('session_id', sessionId);
    }

    const { data: existingItem } = await existingItemQuery.maybeSingle();

    // 3. 장바구니에 추가 또는 수량 업데이트
    if (existingItem) {
      // 기존 아이템 수량 증가
      const newQuantity = existingItem.quantity + quantity;

      const { data: updatedItem, error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (updateError) {
        console.error('수량 업데이트 실패:', updateError);
        return NextResponse.json(
          {
            error: {
              code: 'UPDATE_ERROR',
              message: '장바구니 업데이트에 실패했습니다.',
            },
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          data: updatedItem,
          message: '장바구니 수량이 업데이트되었습니다.',
        },
        { status: 200 }
      );
    } else {
      // 새 아이템 추가
      const newItem = {
        product_id,
        quantity,
        user_id: userId || null,
        session_id: userId ? null : sessionId,
      };

      const { data: insertedItem, error: insertError } = await supabase
        .from('cart_items')
        .insert(newItem)
        .select()
        .single();

      if (insertError) {
        console.error('장바구니 추가 실패:', insertError);
        return NextResponse.json(
          {
            error: {
              code: 'INSERT_ERROR',
              message: '장바구니에 추가하지 못했습니다.',
            },
          },
          { status: 500 }
        );
      }

      // 비회원인 경우 세션 ID를 쿠키에 저장
      const response = NextResponse.json(
        {
          data: insertedItem,
          message: '장바구니에 추가되었습니다.',
        },
        { status: 201 }
      );

      if (!userId && sessionId) {
        response.cookies.set('cart_session', sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30일
        });
      }

      return response;
    }
  } catch (error) {
    console.error('장바구니 추가 중 예외 발생:', error);
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
