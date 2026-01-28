/**
 * Admin Products Management Page
 *
 * - Neo-Brutalism 디자인
 * - 상품 목록 조회 (모든 상태)
 * - 검색 및 필터링
 */

import { Suspense } from 'react';
import { createServerClient } from '@/lib/supabase/server';
import ProductsList from '@/components/admin/products-list';
import { Package, Plus } from 'lucide-react';
import Link from 'next/link';

interface SearchParams {
  page?: string;
  limit?: string;
  status?: string;
  category?: string;
  search?: string;
  sort?: string;
}

interface AdminProductsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const resolvedParams = await searchParams;

  const supabase = await createServerClient();

  const page = parseInt(resolvedParams.page || '1', 10);
  const limit = parseInt(resolvedParams.limit || '12', 10);
  const status = resolvedParams.status;
  const category = resolvedParams.category;
  const search = resolvedParams.search;
  const sort = resolvedParams.sort || 'newest';

  let query = supabase
    .from('products')
    .select('*, categories(id, name, slug)', { count: 'exact' });

  if (status) {
    query = query.eq('status', status as 'draft' | 'active' | 'archived' | 'hidden');
  }

  if (category) {
    query = query.eq('category_id', category);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  switch (sort) {
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'popular':
      query = query.order('sales_count', { ascending: false });
      break;
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data: products, error, count } = await query;

  if (error) {
    console.error('Products query error:', error);
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-neo-green border-3 border-neo-black flex items-center justify-center shadow-neo">
            <Package className="w-6 h-6 text-neo-black" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-neo-black uppercase tracking-tight">
              상품 관리
            </h1>
            <p className="text-neo-black/60 font-medium">
              상품을 등록하고 관리합니다
            </p>
          </div>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-neo-blue text-neo-white border-3 border-neo-black font-bold uppercase shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-sm transition-all"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} />
          상품 등록
        </Link>
      </div>

      {/* 상품 목록 */}
      <Suspense fallback={<ProductsListSkeleton />}>
        <ProductsList
          products={(products || []) as any}
          categories={categories || []}
          pagination={{
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
          }}
          filters={{
            status,
            category,
            search,
            sort,
          }}
        />
      </Suspense>
    </div>
  );
}

function ProductsListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-10 w-64 bg-neo-cream border-3 border-neo-black animate-pulse" />
        <div className="h-10 w-32 bg-neo-cream border-3 border-neo-black animate-pulse" />
      </div>
      <div className="border-3 border-neo-black">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 border-b-2 border-neo-black bg-neo-cream/30 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
