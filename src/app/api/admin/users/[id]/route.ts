/**
 * @file src/app/api/admin/users/[id]/route.ts
 * @description 관리자 사용자 상세 조회 및 수정 API
 * @task P7-T7.2
 *
 * GET /api/admin/users/[id] - 회원 상세 조회 (주문 이력, 후기, 문의 통계 포함)
 * PATCH /api/admin/users/[id] - 회원 정보 수정 (등급, 차단, 메모)
 *
 * 권한: 관리자 전용
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, createAdminClient } from '@/lib/supabase/server';
import { checkAdminRole } from '@/lib/middleware/admin';
import { z } from 'zod';

// ============================================================================
// GET /api/admin/users/[id] - 회원 상세 조회
// ============================================================================

export async function GET(
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

    // 2. Admin 클라이언트로 사용자 정보 조회
    const adminSupabase = createAdminClient();

    const { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .select(
        `
        id,
        email,
        nickname,
        avatar_url,
        role,
        grade,
        points,
        total_order_amount,
        is_blocked,
        blocked_reason,
        blocked_at,
        last_login_at,
        created_at,
        updated_at
      `
      )
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
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

    // 3. 주문 이력 조회 (최근 10개)
    const { data: orders } = await adminSupabase
      .from('orders')
      .select(
        `
        id,
        order_number,
        status,
        total_amount,
        discount_amount,
        paid_at,
        created_at
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    // 4. 통계 조회
    // 4-1. 총 주문 수 및 총 구매액
    const { count: totalOrders } = await adminSupabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'paid');

    const { data: orderStats } = await adminSupabase
      .from('orders')
      .select('total_amount')
      .eq('user_id', userId)
      .eq('status', 'paid');

    const totalSpent =
      orderStats?.reduce((sum, order) => sum + (order.total_amount || 0), 0) ||
      0;

    // 4-2. 후기 수
    const { count: totalReviews } = await adminSupabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // 4-3. 문의 수
    const { count: totalInquiries } = await adminSupabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // 5. 응답
    return NextResponse.json({
      user: profile,
      orders: orders || [],
      stats: {
        totalOrders: totalOrders || 0,
        totalSpent,
        totalReviews: totalReviews || 0,
        totalInquiries: totalInquiries || 0,
      },
    });
  } catch (error: any) {
    console.error('User detail error:', error);
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

// ============================================================================
// PATCH /api/admin/users/[id] - 회원 정보 수정
// ============================================================================

const updateUserSchema = z.object({
  grade: z.enum(['bronze', 'silver', 'gold', 'vip']).optional(),
  isBlocked: z.boolean().optional(),
  blockedReason: z.string().nullable().optional(),
  nickname: z.string().min(1).max(50).optional(),
  role: z.enum(['user', 'admin']).optional(),
});

export async function PATCH(
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
    const validated = updateUserSchema.parse(body);

    // 3. Admin 클라이언트로 현재 정보 조회
    const adminSupabase = createAdminClient();

    const { data: currentProfile } = await adminSupabase
      .from('profiles')
      .select('grade, is_blocked')
      .eq('id', userId)
      .single();

    if (!currentProfile) {
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

    // 4. 업데이트 데이터 준비
    const updateData: any = {};

    if (validated.nickname !== undefined) {
      updateData.nickname = validated.nickname;
    }

    if (validated.role !== undefined) {
      updateData.role = validated.role;
    }

    if (validated.grade !== undefined) {
      updateData.grade = validated.grade;
    }

    if (validated.isBlocked !== undefined) {
      updateData.is_blocked = validated.isBlocked;

      if (validated.isBlocked) {
        // 차단 시
        updateData.blocked_reason =
          validated.blockedReason || '관리자에 의해 차단됨';
        updateData.blocked_at = new Date().toISOString();
      } else {
        // 차단 해제 시
        updateData.blocked_reason = null;
        updateData.blocked_at = null;
      }
    } else if (validated.blockedReason !== undefined) {
      updateData.blocked_reason = validated.blockedReason;
    }

    // 5. 프로필 업데이트
    const { data: updatedProfile, error: updateError } = await adminSupabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Update user error:', updateError);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: '사용자 정보 수정 중 오류가 발생했습니다.',
            details: updateError.message,
          },
        },
        { status: 500 }
      );
    }

    // 6. 등급 변경 이력 기록 (등급이 변경된 경우)
    if (
      validated.grade &&
      validated.grade !== currentProfile.grade
    ) {
      await adminSupabase.from('grade_histories').insert({
        user_id: userId,
        from_grade: currentProfile.grade,
        to_grade: validated.grade,
        reason: 'manual',
        changed_by: user.id,
      });
    }

    // 7. 응답
    return NextResponse.json({
      user: {
        ...updatedProfile,
        isBlocked: updatedProfile.is_blocked,
        blockedReason: updatedProfile.blocked_reason,
        blockedAt: updatedProfile.blocked_at,
        lastLoginAt: updatedProfile.last_login_at,
      },
    });
  } catch (error: any) {
    console.error('Update user error:', error);

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
