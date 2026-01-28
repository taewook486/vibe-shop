/**
 * P7-T7.3: 관리자 사용자 상세 페이지
 *
 * 기능:
 * - 사용자 상세 정보 조회
 * - 사용자 정보 수정 (등급, 상태, 닉네임)
 * - 주문 이력 표시
 * - 통계 표시
 *
 * 권한: 관리자 전용
 */

import { notFound } from 'next/navigation';
import { createServerClient, createAdminClient } from '@/lib/supabase/server';
import UserDetail from '@/components/admin/user-detail';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { AdminUserWithStats, AdminOrder } from '@/types/admin';

interface AdminUserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminUserDetailPage({
  params,
}: AdminUserDetailPageProps) {
  // 참고: middleware.ts에서 이미 관리자 권한 체크 완료

  const { id: userId } = await params;

  // 1. Supabase 클라이언트 생성 (DB 접근용)
  const supabase = await createServerClient();

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
    notFound();
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
  // 4-1. 총 주문 수
  const { count: totalOrders } = await adminSupabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'paid');

  // 4-2. 총 구매액 (이미 profile.total_order_amount에 있음)
  const { data: orderStats } = await adminSupabase
    .from('orders')
    .select('total_amount')
    .eq('user_id', userId)
    .eq('status', 'paid');

  const totalSpent =
    orderStats?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

  // 4-3. 후기 수
  const { count: totalReviews } = await adminSupabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // 4-4. 문의 수
  const { count: totalInquiries } = await adminSupabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // 5. 사용자 데이터 조합
  const userWithStats: AdminUserWithStats = {
    id: profile.id,
    email: profile.email,
    nickname: profile.nickname,
    avatar_url: profile.avatar_url,
    role: profile.role,
    grade: profile.grade,
    points: profile.points,
    total_order_amount: profile.total_order_amount,
    is_blocked: profile.is_blocked,
    blocked_reason: profile.blocked_reason,
    blocked_at: profile.blocked_at,
    last_login_at: profile.last_login_at,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    stats: {
      totalOrders: totalOrders || 0,
      totalSpent,
      totalReviews: totalReviews || 0,
      totalInquiries: totalInquiries || 0,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-6">
          <Link href="/admin/users">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              사용자 목록으로 돌아가기
            </Button>
          </Link>
        </div>

        <UserDetail user={userWithStats} orders={(orders || []) as AdminOrder[]} />
      </div>
    </div>
  );
}
