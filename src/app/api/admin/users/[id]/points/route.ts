/**
 * @file src/app/api/admin/users/[id]/points/route.ts
 * @description 관리자 적립금 지급/차감 API
 * @task P7-T7.2
 *
 * POST /api/admin/users/[id]/points - 적립금 지급/차감
 *
 * Body:
 * - amount: 적립금 변경량 (양수: 지급, 음수: 차감)
 * - reason: 사유 (필수)
 *
 * 권한: 관리자 전용
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, createAdminClient } from '@/lib/supabase/server';
import { checkAdminRole } from '@/lib/middleware/admin';
import { z } from 'zod';

// ============================================================================
// POST /api/admin/users/[id]/points - 적립금 지급/차감
// ============================================================================

const pointsSchema = z.object({
  amount: z.number().int().refine((val) => val !== 0, {
    message: '금액은 0이 아니어야 합니다.',
  }),
  reason: z.string().min(1, '사유를 입력해주세요.'),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. 관리자 권한 체크
    const supabase = await createServerClient();
    const { isAdmin, user } = await checkAdminRole(supabase);

    if (!isAdmin || !user) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: '관리자 권한이 필요합니다.',
          },
        },
        { status: 403 }
      );
    }

    const { id: userId } = await params;

    // 2. 요청 바디 검증
    const body = await request.json();
    const validated = pointsSchema.parse(body);

    // 3. Admin 클라이언트로 현재 잔액 조회
    const adminSupabase = createAdminClient();

    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();

    if (!profile) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: '사용자를 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    const currentBalance = profile.points || 0;

    // 4. 잔액 검증 (차감 시)
    if (validated.amount < 0 && currentBalance + validated.amount < 0) {
      return NextResponse.json(
        {
          error: {
            code: 'INSUFFICIENT_POINTS',
            message: `적립금 잔액이 부족합니다. (현재: ${currentBalance}, 차감: ${Math.abs(validated.amount)})`,
          },
        },
        { status: 400 }
      );
    }

    // 5. 적립금 변경 (DB 함수 사용)
    let newBalance: number;
    let transactionType: 'earn' | 'adjust';

    if (validated.amount > 0) {
      // 지급
      const { data, error } = await adminSupabase.rpc('add_user_points', {
        p_user_id: userId,
        p_amount: validated.amount,
        p_reason: validated.reason,
        p_reference_type: 'manual',
        p_created_by: user.id,
      });

      if (error) {
        console.error('Add points error:', error);
        return NextResponse.json(
          {
            error: {
              code: 'DATABASE_ERROR',
              message: '적립금 지급 중 오류가 발생했습니다.',
              details: error.message,
            },
          },
          { status: 500 }
        );
      }

      newBalance = data;
      transactionType = 'earn';
    } else {
      // 차감 (adjust 타입으로 처리)
      const { data: updatedProfile, error: updateError } = await adminSupabase
        .from('profiles')
        .update({
          points: currentBalance + validated.amount,
        })
        .eq('id', userId)
        .select('points')
        .single();

      if (updateError) {
        console.error('Deduct points error:', updateError);
        return NextResponse.json(
          {
            error: {
              code: 'DATABASE_ERROR',
              message: '적립금 차감 중 오류가 발생했습니다.',
              details: updateError.message,
            },
          },
          { status: 500 }
        );
      }

      newBalance = updatedProfile.points;
      transactionType = 'adjust';

      // 히스토리 수동 기록 (차감)
      await adminSupabase.from('point_histories').insert({
        user_id: userId,
        type: transactionType,
        amount: validated.amount,
        balance: newBalance,
        reason: validated.reason,
        reference_type: 'manual',
        created_by: user.id,
      });
    }

    // 6. 최근 트랜잭션 조회
    const { data: transaction } = await adminSupabase
      .from('point_histories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // 7. 응답
    return NextResponse.json({
      newBalance,
      transaction: transaction || null,
      message:
        validated.amount > 0
          ? `${validated.amount} 포인트가 지급되었습니다.`
          : `${Math.abs(validated.amount)} 포인트가 차감되었습니다.`,
    });
  } catch (error: any) {
    console.error('Points API error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: '잘못된 요청입니다.',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: '서버 오류가 발생했습니다.',
          details: error.message,
        },
      },
      { status: 500 }
    );
  }
}
