/**
 * Review API Route
 *
 * GET /api/reviews - 후기 목록 조회
 * POST /api/reviews - 후기 작성
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ============================================================================
// Validation Schemas
// ============================================================================

const createReviewSchema = z.object({
  product_id: z.string().uuid('유효한 상품 ID를 입력해주세요.'),
  order_item_id: z.string().uuid('유효한 주문 아이템 ID를 입력해주세요.'),
  rating: z
    .number()
    .int()
    .min(1, '별점은 1점 이상이어야 합니다.')
    .max(5, '별점은 5점 이하여야 합니다.'),
  title: z
    .string()
    .min(5, '제목은 5자 이상이어야 합니다.')
    .max(200, '제목은 200자 이하여야 합니다.'),
  content: z
    .string()
    .min(10, '내용은 10자 이상이어야 합니다.')
    .max(5000, '내용은 5000자 이하여야 합니다.'),
  images: z
    .array(z.string().url())
    .max(5, '이미지는 최대 5장까지 첨부할 수 있습니다.')
    .default([]),
});

// ============================================================================
// Types
// ============================================================================

type SortOption = 'latest' | 'likes' | 'rating_high' | 'rating_low';

// ============================================================================
// GET /api/reviews - 후기 목록 조회
// ============================================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // 쿼리 파라미터 파싱
    const sort = (searchParams.get('sort') || 'latest') as SortOption;
    const rating = searchParams.get('rating') ? parseInt(searchParams.get('rating')!) : null;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    const supabase = createAdminClient();

    // 쿼리 빌드
    let query = supabase
      .from('reviews')
      .select(
        `
        id,
        product_id,
        user_id,
        rating,
        title,
        content,
        images,
        like_count,
        view_count,
        is_best,
        created_at,
        updated_at,
        profiles:user_id (
          nickname,
          avatar_url
        ),
        products:product_id (
          name,
          slug
        )
      `,
        { count: 'exact' }
      );

    // 별점 필터
    if (rating) {
      query = query.eq('rating', rating);
    }

    // 정렬
    switch (sort) {
      case 'likes':
        query = query.order('like_count', { ascending: false });
        break;
      case 'rating_high':
        query = query.order('rating', { ascending: false });
        break;
      case 'rating_low':
        query = query.order('rating', { ascending: true });
        break;
      case 'latest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    // 페이지네이션
    const { data: reviews, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error('후기 목록 조회 실패:', error);
      return NextResponse.json(
        {
          error: {
            code: 'FETCH_ERROR',
            message: '후기 목록 조회에 실패했습니다.',
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        reviews: reviews || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('후기 목록 조회 중 예외 발생:', error);
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
// POST /api/reviews - 후기 작성
// ============================================================================

export async function POST(request: Request) {
  try {
    // 1. NextAuth 세션 확인
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: '로그인이 필요합니다.',
          },
        },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    // 2. 요청 본문 파싱 및 유효성 검증
    const body = await request.json();
    const validation = createReviewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: validation.error.issues[0]?.message || '잘못된 요청입니다.',
            details: validation.error.issues,
          },
        },
        { status: 400 }
      );
    }

    const { product_id, order_item_id, rating, title, content, images } = validation.data;

    // 3. 구매 검증 (order_item_id가 사용자의 것인지, 결제 완료 상태인지)
    const { data: orderItem, error: orderError } = await supabase
      .from('order_items')
      .select(
        `
        id,
        product_id,
        order_id,
        orders!inner (
          id,
          user_id,
          status
        )
      `
      )
      .eq('id', order_item_id)
      .eq('orders.user_id', userId)
      .in('orders.status', ['paid', 'completed'])
      .single();

    if (orderError || !orderItem) {
      return NextResponse.json(
        {
          error: {
            code: 'PURCHASE_VERIFICATION_FAILED',
            message: '구매 내역을 확인할 수 없습니다. 결제가 완료된 상품만 후기를 작성할 수 있습니다.',
          },
        },
        { status: 403 }
      );
    }

    // 상품 ID 일치 확인
    if (orderItem.product_id !== product_id) {
      return NextResponse.json(
        {
          error: {
            code: 'PRODUCT_MISMATCH',
            message: '주문 아이템과 상품이 일치하지 않습니다.',
          },
        },
        { status: 400 }
      );
    }

    // 4. 중복 후기 확인 (같은 order_item_id로 이미 작성한 후기가 있는지)
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('order_item_id', order_item_id)
      .maybeSingle();

    if (existingReview) {
      return NextResponse.json(
        {
          error: {
            code: 'REVIEW_ALREADY_EXISTS',
            message: '이미 이 상품에 대한 후기를 작성하셨습니다.',
          },
        },
        { status: 400 }
      );
    }

    // 5. 후기 작성
    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        product_id,
        user_id: userId,
        order_item_id,
        rating,
        title,
        content,
        images: images || [],
      })
      .select()
      .single();

    if (insertError) {
      console.error('후기 작성 실패:', insertError);
      return NextResponse.json(
        {
          error: {
            code: 'INSERT_ERROR',
            message: '후기 작성에 실패했습니다.',
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: review,
        message: '후기가 작성되었습니다.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('후기 작성 중 예외 발생:', error);
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
