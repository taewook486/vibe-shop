/**
 * Admin Inquiry Management API
 *
 * PATCH /api/admin/inquiries/[id] - 문의 답변 작성 및 상태 변경
 * DELETE /api/admin/inquiries/[id] - 문의 삭제
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateInquirySchema = z.object({
  answer: z.string().optional(),
  status: z.enum(['pending', 'answered']).optional(),
});

/**
 * PATCH /api/admin/inquiries/[id]
 * 문의 답변 작성 및 상태 변경
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
    const validated = updateInquirySchema.safeParse(body);

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

    const { answer, status } = validated.data;

    // 업데이트할 필드 구성
    const updateData: {
      answer?: string;
      answered_at?: string;
      answered_by?: string;
      status?: 'pending' | 'answered';
    } = {};
    if (answer !== undefined) {
      updateData.answer = answer;
      updateData.answered_at = new Date().toISOString();
      updateData.answered_by = user.id;
    }
    if (status !== undefined) {
      updateData.status = status;
    }

    // 문의 업데이트
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
          thumbnail_url
        )
      `
      )
      .single();

    if (updateError) {
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
 * DELETE /api/admin/inquiries/[id]
 * 문의 삭제
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

    // 문의 삭제
    const { error: deleteError } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Inquiry delete error:', deleteError);
      return NextResponse.json(
        { error: { code: 'DELETE_ERROR', message: deleteError.message } },
        { status: 500 }
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
