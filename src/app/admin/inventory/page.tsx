/**
 * P7-T7.11: 재고 관리 페이지
 *
 * 기능:
 * - 상품별 재고 현황 표시
 * - 저재고 경고 표시
 * - 재고 부족 상품 필터
 * - 재고 조정 및 이력 조회
 *
 * 권한: 관리자 전용
 */

import { Suspense } from 'react';
import { createServerClient } from '@/lib/supabase/server';
import InventoryList from '@/components/admin/inventory-list';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchParams {
  page?: string;
  limit?: string;
  low_stock?: string;
  search?: string;
}

interface InventoryPageProps {
  searchParams: SearchParams;
}

export default async function InventoryPage({
  searchParams,
}: InventoryPageProps) {
  // 참고: middleware.ts에서 이미 관리자 권한 체크 완료

  // 1. Supabase 클라이언트 생성 (DB 접근용)
  const supabase = await createServerClient();

  // 2. 쿼리 파라미터 파싱
  const page = parseInt(searchParams.page || '1', 10);
  const limit = parseInt(searchParams.limit || '20', 10);
  const lowStock = searchParams.low_stock === 'true';
  const search = searchParams.search;

  // 3. 재고 현황 조회
  let query = supabase
    .from('products')
    .select(
      `
      id,
      name,
      slug,
      stock,
      stock_alert_threshold,
      status,
      price,
      created_at,
      updated_at
    `,
      { count: 'exact' }
    );

  // 검색 필터
  if (search) {
    query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
  }

  // 정렬
  query = query.order('name', { ascending: true });

  // 저재고 필터 처리
  let products: any[] = [];
  let total = 0;

  if (lowStock) {
    // 저재고 상품 조회 (RPC 함수 사용)
    const { data: lowStockProducts, error: rpcError } = await supabase.rpc(
      'get_low_stock_products'
    );

    if (rpcError) {
      console.error('Low stock products query error:', rpcError);
    } else {
      // 검색 필터 적용
      let filtered = lowStockProducts || [];
      if (search) {
        filtered = filtered.filter(
          (p: any) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.slug.toLowerCase().includes(search.toLowerCase())
        );
      }

      total = filtered.length;
      const from = (page - 1) * limit;
      const to = from + limit;
      products = filtered.slice(from, to);

      // 추가 데이터 조회 (가격, 생성일, 수정일)
      if (products.length > 0) {
        const productIds = products.map((p: any) => p.id);
        const { data: fullProducts } = await supabase
          .from('products')
          .select('id, price, created_at, updated_at')
          .in('id', productIds);

        if (fullProducts) {
          products = products.map((p: any) => {
            const full = fullProducts.find((fp) => fp.id === p.id);
            return { ...p, ...full };
          });
        }
      }
    }
  } else {
    // 일반 재고 조회
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Products query error:', error);
    }

    products = data || [];
    total = count || 0;
  }

  // 4. 통계 데이터 계산
  const { data: allProducts } = await supabase
    .from('products')
    .select('stock, stock_alert_threshold, price, status')
    .eq('status', 'active');

  const stats = {
    total_products: allProducts?.length || 0,
    low_stock_count:
      allProducts?.filter(
        (p: any) => p.stock <= (p.stock_alert_threshold || 5)
      ).length || 0,
    out_of_stock_count:
      allProducts?.filter((p: any) => p.stock === 0).length || 0,
    total_stock_value:
      allProducts?.reduce((sum: number, p: any) => sum + p.stock * p.price, 0) ||
      0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">재고 관리</h1>
          <p className="text-muted-foreground mt-2">
            상품 재고를 조회하고 관리할 수 있습니다.
          </p>
        </div>

        <Suspense fallback={<InventoryListSkeleton />}>
          <InventoryList
            products={products}
            stats={stats}
            pagination={{
              page,
              limit,
              total,
              totalPages: Math.ceil(total / limit),
            }}
            filters={{
              low_stock: lowStock,
              search,
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}

function InventoryListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="grid gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );
}
