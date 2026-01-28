/**
 * Review Detail API Route
 *
 * GET /api/reviews/[id] - 후기 상세 조회
 * PATCH /api/reviews/[id] - 후기 수정
 * DELETE /api/reviews/[id] - 후기 삭제
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ============================================================================
// Validation Schemas
// ============================================================================

const updateReviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, '별점은 1점 이상이어야 합니다.')
    .max(5, '별점은 5점 이하여야 합니다.')
    .optional(),
  title: z
    .string()
    .min(5, '제목은 5자 이상이어야 합니다.')
    .max(200, '제목은 200자 이하여야 합니다.')
    .optional(),
  content: z
    .string()
    .min(10, '내용은 10자 이상이어야 합니다.')
    .max(5000, '내용은 5000자 이하여야 합니다.')
    .optional(),
  images: z
    .array(z.string().url())
    .max(5, '이미지는 최대 5장까지 첨부할 수 있습니다.')
    .optional(),
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 관리자 권한 확인
 */
async function isAdmin(supabase: any, userId: string): Promise<boolean> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  return profile?.role === 'admin';
}

// ============================================================================
// GET /api/reviews/[id] - 후기 상세 조회
// ============================================================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerClient();

    const { data: review, error } = await supabase
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
          slug,
          thumbnail_url:metadata->thumbnail_url
        )
      `
      )
      .eq('id', id)
      .single();

    if (error || !review) {
      return NextResponse.json(
        {
          error: {
            code: 'REVIEW_NOT_FOUND',
            message: '후기를 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    // 조회수 증가 (비동기, 에러 무시)
    supabase.rpc('increment_review_view_count', { review_id: id }).then();

    return NextResponse.json(
      {
        data: review,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('후기 조회 중 예외 발생:', error);
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
// PATCH /api/reviews/[id] - 후기 수정
// ============================================================================

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerClient();

    // 1. 사용자 인증 확인
    const { data: authData, error: authError } = await supabase.auth.getUser();
    const user = authData?.user;

    if (!user) {
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

    // 2. 후기 조회 및 권한 확인
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (reviewError || !review) {
      return NextResponse.json(
        {
          error: {
            code: 'REVIEW_NOT_FOUND',
            message: '후기를 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    // 본인 확인
    if (review.user_id !== user.id) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: '본인이 작성한 후기만 수정할 수 있습니다.',
          },
        },
        { status: 403 }
      );
    }

    // 3. 요청 본문 파싱 및 유효성 검증
    const body = await request.json();
    const validation = updateReviewSchema.safeParse(body);

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

    // 4. 후기 수정 (updated_at은 트리거가 자동 갱신)
    const updateData: any = {};
    if (validation.data.rating !== undefined) updateData.rating = validation.data.rating;
    if (validation.data.title !== undefined) updateData.title = validation.data.title;
    if (validation.data.content !== undefined) updateData.content = validation.data.content;
    if (validation.data.images !== undefined) updateData.images = validation.data.images;

    const { data: updatedReview, error: updateError } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('후기 수정 실패:', updateError);
      return NextResponse.json(
        {
          error: {
            code: 'UPDATE_ERROR',
            message: '후기 수정에 실패했습니다.',
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: updatedReview,
        message: '후기가 수정되었습니다.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('후기 수정 중 예외 발생:', error);
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
// DELETE /api/reviews/[id] - 후기 삭제
// ============================================================================

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerClient();

    // 1. 사용자 인증 확인
    const { data: authData, error: authError } = await supabase.auth.getUser();
    const user = authData?.user;

    if (!user) {
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

    // 2. 관리자 권한 확인
    const adminCheck = await isAdmin(supabase, user.id);

    // 3. 후기 조회 및 권한 확인
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (reviewError || !review) {
      return NextResponse.json(
        {
          error: {
            code: 'REVIEW_NOT_FOUND',
            message: '후기를 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    // 본인 또는 관리자만 삭제 가능
    if (review.user_id !== user.id && !adminCheck) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: '본인이 작성한 후기만 삭제할 수 있습니다.',
          },
        },
        { status: 403 }
      );
    }

    // 4. 후기 삭제
    const { error: deleteError } = await supabase.from('reviews').delete().eq('id', id);

    if (deleteError) {
      console.error('후기 삭제 실패:', deleteError);
      return NextResponse.json(
        {
          error: {
            code: 'DELETE_ERROR',
            message: '후기 삭제에 실패했습니다.',
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: '후기가 삭제되었습니다.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('후기 삭제 중 예외 발생:', error);
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
