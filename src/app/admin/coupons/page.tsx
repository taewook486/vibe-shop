/**
 * P7-T7.8: 쿠폰 관리 페이지
 *
 * 기능:
 * - 쿠폰 목록 조회
 * - 필터링 (타입, 상태, 유효기간)
 * - 정렬 (생성일, 사용횟수)
 * - 쿠폰 등록/수정
 *
 * 권한: 관리자 전용
 */

import { Suspense } from 'react';
import { createServerClient } from '@/lib/supabase/server';
import CouponsList from '@/components/admin/coupons-list';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchParams {
  page?: string;
  limit?: string;
  type?: string;
  status?: string;
  search?: string;
  sort?: string;
}

interface AdminCouponsPageProps {
  searchParams: SearchParams;
}

export default async function AdminCouponsPage({
  searchParams,
}: AdminCouponsPageProps) {
  // 참고: middleware.ts에서 이미 관리자 권한 체크 완료

  // 1. Supabase 클라이언트 생성 (DB 접근용)
  const supabase = await createServerClient();

  // 2. 쿼리 파라미터 파싱
  const page = parseInt(searchParams.page || '1', 10);
  const limit = parseInt(searchParams.limit || '20', 10);
  const type = searchParams.type;
  const status = searchParams.status;
  const search = searchParams.search;
  const sort = searchParams.sort || 'newest';

  // 3. 쿠폰 목록 조회
  let query = supabase
    .from('coupons')
    .select('*', { count: 'exact' });

  // 타입 필터
  if (type && ['percent', 'fixed', 'free_shipping'].includes(type)) {
    query = query.eq('type', type as 'percent' | 'fixed' | 'free_shipping');
  }

  // 상태 필터
  const now = new Date().toISOString();
  if (status === 'active') {
    query = query
      .eq('is_active', true)
      .lte('start_at', now)
      .gte('end_at', now);
  } else if (status === 'inactive') {
    query = query.eq('is_active', false);
  } else if (status === 'expired') {
    query = query.lt('end_at', now);
  }

  // 검색
  if (search) {
    query = query.or(`code.ilike.%${search}%,name.ilike.%${search}%`);
  }

  // 정렬
  switch (sort) {
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'usage':
      query = query.order('used_count', { ascending: false });
      break;
    case 'end_date':
      query = query.order('end_at', { ascending: true });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  // 페이지네이션
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data: coupons, error, count } = await query;

  if (error) {
    console.error('Coupons query error:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">쿠폰 관리</h1>
          <p className="text-muted-foreground mt-2">
            쿠폰을 생성하고 관리할 수 있습니다.
          </p>
        </div>

        <Suspense fallback={<CouponsListSkeleton />}>
          <CouponsList
            coupons={(coupons || []) as any}
            pagination={{
              page,
              limit,
              total: count || 0,
              totalPages: Math.ceil((count || 0) / limit),
            }}
            filters={{
              type,
              status,
              search,
              sort,
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}

function CouponsListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}
