/**
 * Inquiry Answer API Route (Admin Only)
 *
 * POST /api/inquiries/[id]/answer - 관리자 답변
 *
 * Features:
 * - 관리자만 답변 가능 (role='admin' 확인)
 * - 답변 작성 시 status 자동 변경 (트리거)
 * - answered_by, answered_at 자동 설정
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';
import { AnswerInquirySchema } from '@/types/inquiry';

/**
 * POST /api/inquiries/[id]/answer
 * 관리자 답변
 *
 * Body:
 * - answer: 답변 내용
 *
 * Requirements:
 * - 관리자만 가능 (role='admin')
 * - 트리거에 의해 status='answered', answered_at=NOW() 자동 설정
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // NextAuth 세션 확인
    const session = await auth();
    const userId = session?.user?.id;
    const userRole = session?.user?.role;

    if (!userId) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    // 관리자 권한 확인 (NextAuth 세션에서 직접 확인)
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const supabase = createAdminClient();

    // 요청 바디 파싱
    const body = await request.json();

    // Zod 스키마 검증
    const validated = AnswerInquirySchema.safeParse(body);
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

    const { answer } = validated.data;

    // 문의 존재 확인
    const { data: existingInquiry, error: fetchError } = await supabase
      .from('inquiries')
      .select('id, status')
      .eq('id', id)
      .single();

    if (fetchError || !existingInquiry) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Inquiry not found' } },
        { status: 404 }
      );
    }

    // 답변 저장 (트리거에 의해 status, answered_at 자동 설정)
    const { data: inquiry, error: updateError } = await supabase
      .from('inquiries')
      .update({
        answer,
        answered_by: userId,
        // status와 answered_at은 트리거에서 자동 설정
      })
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
        ),
        answerer:profiles!inquiries_answered_by_fkey (
          id,
          email,
          nickname,
          avatar_url
        )
      `
      )
      .single();

    if (updateError) {
      console.error('Answer creation error:', updateError);
      return NextResponse.json(
        { error: { code: 'UPDATE_ERROR', message: updateError.message } },
        { status: 500 }
      );
    }

    // TODO: 이메일 알림 발송 (선택사항)
    // if (inquiry.author.email) {
    //   await sendInquiryAnswerEmail(inquiry.author.email, inquiry);
    // }

    return NextResponse.json({ inquiry });
  } catch (error) {
    console.error('Inquiry answer error:', error);
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
