/**
 * Admin Review Management API
 *
 * PATCH /api/admin/reviews/[id] - 후기 수정 (베스트 선정)
 * DELETE /api/admin/reviews/[id] - 후기 삭제
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateReviewSchema = z.object({
  is_best: z.boolean().optional(),
});

/**
 * PATCH /api/admin/reviews/[id]
 * 후기 수정 (베스트 선정/해제)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerClient();

    // 관리자 권한 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    // 관리자 권한 확인
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    // 요청 바디 파싱 및 검증
    const body = await request.json();
    const validated = updateReviewSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: validated.error.issues,
          },
        },
        { status: 400 }
      );
    }

    const { is_best } = validated.data;

    // 후기 업데이트
    const { data: review, error: updateError } = await supabase
      .from('reviews')
      .update({ is_best })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Review update error:', updateError);
      return NextResponse.json(
        { error: { code: 'UPDATE_ERROR', message: updateError.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error('Review update error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/reviews/[id]
 * 후기 삭제
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerClient();

    // 관리자 권한 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    // 관리자 권한 확인
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    // 후기 삭제
    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Review delete error:', deleteError);
      return NextResponse.json(
        { error: { code: 'DELETE_ERROR', message: deleteError.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Review delete error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
