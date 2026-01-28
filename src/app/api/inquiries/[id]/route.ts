/**
 * Inquiry Detail API Route
 *
 * GET /api/inquiries/[id] - 문의 상세 조회
 * PATCH /api/inquiries/[id] - 문의 수정 (작성자만, 답변 전)
 * DELETE /api/inquiries/[id] - 문의 삭제 (작성자만, 답변 전)
 *
 * Features:
 * - 비밀글 접근 제어 (RLS 정책)
 * - 조회수 자동 증가
 * - 답변 전에만 수정/삭제 가능 (RLS 정책)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { UpdateInquirySchema } from '@/types/inquiry';

/**
 * GET /api/inquiries/[id]
 * 문의 상세 조회
 *
 * - 비밀글은 작성자/관리자만 조회 가능 (RLS 정책)
 * - 조회수 자동 증가
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id } = await params;

    // 문의 조회 (작성자, 상품, 답변자 정보 포함)
    const { data: inquiry, error } = await supabase
      .from('inquiries')
      .select(
        `
        *,
        author:profiles!inquiries_user_id_fkey (
          id,
          email,
          nickname,
          avatar_url
        ),
        product:products (
          id,
          name,
          slug,
          thumbnail_url:metadata->thumbnail_url
        ),
        answerer:profiles!inquiries_answered_by_fkey (
          id,
          email,
          nickname,
          avatar_url
        )
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Inquiry not found' } },
          { status: 404 }
        );
      }

      console.error('Inquiry fetch error:', error);
      return NextResponse.json(
        { error: { code: 'FETCH_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    // 조회수 증가 (헬퍼 함수 사용)
    const { error: viewError } = await supabase.rpc('increment_inquiry_view_count', {
      inquiry_id: id,
    });

    if (viewError) {
      console.error('View count increment error:', viewError);
      // 조회수 증가 실패해도 조회는 성공
    }

    // 조회수 증가 반영
    const updatedInquiry = {
      ...inquiry,
      view_count: inquiry.view_count + 1,
    };

    return NextResponse.json({ inquiry: updatedInquiry });
  } catch (error) {
    console.error('Inquiry detail API error:', error);
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
 * PATCH /api/inquiries/[id]
 * 문의 수정
 *
 * - 작성자만 수정 가능 (RLS 정책)
 * - 답변 전에만 수정 가능 (RLS 정책: status='pending')
 *
 * Body:
 * - category?: 카테고리
 * - title?: 제목
 * - content?: 내용
 * - is_private?: 비밀글 여부
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id } = await params;

    // 인증 확인
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

    // 요청 바디 파싱
    const body = await request.json();

    // Zod 스키마 검증
    const validated = UpdateInquirySchema.safeParse(body);
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

    const updateData = validated.data;

    // 문의 수정 (RLS 정책으로 본인 & status='pending'만 수정 가능)
    const { data: inquiry, error: updateError } = await supabase
      .from('inquiries')
      .update(updateData)
      .eq('id', id)
      .select(
        `
        *,
        author:profiles!inquiries_user_id_fkey (
          id,
          email,
          nickname,
          avatar_url
        ),
        product:products (
          id,
          name,
          slug,
          thumbnail_url:metadata->thumbnail_url
        )
      `
      )
      .single();

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          {
            error: {
              code: 'FORBIDDEN',
              message: 'Cannot update this inquiry (already answered or not yours)',
            },
          },
          { status: 403 }
        );
      }

      console.error('Inquiry update error:', updateError);
      return NextResponse.json(
        { error: { code: 'UPDATE_ERROR', message: updateError.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ inquiry });
  } catch (error) {
    console.error('Inquiry update error:', error);
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
 * DELETE /api/inquiries/[id]
 * 문의 삭제
 *
 * - 작성자만 삭제 가능 (RLS 정책)
 * - 답변 전에만 삭제 가능 (RLS 정책: status='pending')
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id } = await params;

    // 인증 확인
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

    // 문의 삭제 (RLS 정책으로 본인 & status='pending'만 삭제 가능)
    const { error: deleteError } = await supabase.from('inquiries').delete().eq('id', id);

    if (deleteError) {
      console.error('Inquiry delete error:', deleteError);
      return NextResponse.json(
        {
          error: {
            code: 'DELETE_ERROR',
            message: 'Cannot delete this inquiry (already answered or not yours)',
          },
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Inquiry delete error:', error);
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
