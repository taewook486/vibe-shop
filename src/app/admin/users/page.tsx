/**
 * Admin Users Management Page
 *
 * - Neo-Brutalism 디자인
 * - 사용자 목록 조회
 * - 검색 및 필터링
 */

import { Suspense } from 'react';
import { createServerClient, createAdminClient } from '@/lib/supabase/server';
import UsersList from '@/components/admin/users-list';
import { Users } from 'lucide-react';
import type { AdminUser } from '@/types/admin';

interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
  grade?: string;
  isBlocked?: string;
  sort?: string;
}

interface AdminUsersPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const resolvedParams = await searchParams;

  const page = parseInt(resolvedParams.page || '1', 10);
  const limit = parseInt(resolvedParams.limit || '20', 10);
  const search = resolvedParams.search;
  const grade = resolvedParams.grade;
  const isBlocked = resolvedParams.isBlocked;
  const sort = resolvedParams.sort || 'newest';

  const adminSupabase = createAdminClient();

  let query = adminSupabase
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
    `,
      { count: 'exact' }
    );

  if (search) {
    query = query.or(`email.ilike.%${search}%,nickname.ilike.%${search}%`);
  }

  const validGrades = ['bronze', 'silver', 'gold', 'vip'] as const;
  if (grade && validGrades.includes(grade as any)) {
    query = query.eq('grade', grade as 'bronze' | 'silver' | 'gold' | 'vip');
  }

  if (isBlocked !== undefined && isBlocked !== null && isBlocked !== 'all') {
    const blocked = isBlocked === 'true';
    query = query.eq('is_blocked', blocked);
  }

  switch (sort) {
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'total_spent':
      query = query.order('total_order_amount', { ascending: false });
      break;
    case 'total_orders':
      query = query.order('total_order_amount', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data: users, error, count } = await query;

  if (error) {
    console.error('Users query error:', error);
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-neo-pink border-3 border-neo-black flex items-center justify-center shadow-neo">
          <Users className="w-6 h-6 text-neo-black" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-neo-black uppercase tracking-tight">
            회원 관리
          </h1>
          <p className="text-neo-black/60 font-medium">
            회원 정보를 조회하고 관리합니다
          </p>
        </div>
      </div>

      {/* 회원 목록 */}
      <Suspense fallback={<UsersListSkeleton />}>
        <UsersList
          users={(users || []) as AdminUser[]}
          pagination={{
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
          }}
          filters={{
            search,
            grade,
            isBlocked,
            sort,
          }}
        />
      </Suspense>
    </div>
  );
}

function UsersListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-10 w-64 bg-neo-cream border-3 border-neo-black animate-pulse" />
        <div className="h-10 w-32 bg-neo-cream border-3 border-neo-black animate-pulse" />
      </div>
      <div className="border-3 border-neo-black">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 border-b-2 border-neo-black bg-neo-cream/30 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
