/**
 * P4-T4.6: 관리자 상품 목록 컴포넌트
 *
 * 기능:
 * - 상품 목록 표시 (테이블 형식)
 * - 검색 및 필터
 * - 상태 변경 (인라인)
 * - 수정/삭제 액션
 * - Neo-Brutalism 디자인
 */

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MoreVertical, Edit, Trash2, Package, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  status: 'draft' | 'active' | 'hidden' | 'archived';
  is_featured: boolean;
  sales_count: number;
  created_at: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

interface ProductsListProps {
  products: Product[];
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    status?: string;
    category?: string;
    search?: string;
    sort?: string;
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(dateString));
}

const STATUS_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  draft: { label: '임시 저장', bg: 'bg-neo-cream', text: 'text-neo-black' },
  active: { label: '판매 중', bg: 'bg-neo-green', text: 'text-neo-black' },
  hidden: { label: '숨김', bg: 'bg-neo-orange', text: 'text-neo-black' },
  archived: { label: '보관', bg: 'bg-neo-pink', text: 'text-neo-black' },
};

export default function ProductsList({
  products,
  categories,
  pagination,
  filters,
}: ProductsListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [isPending, startTransition] = useTransition();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (filters.status) params.set('status', filters.status);
    if (filters.category) params.set('category', filters.category);
    if (filters.sort) params.set('sort', filters.sort);

    startTransition(() => {
      router.push(`/admin/products?${params.toString()}`);
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (key === 'status' && value !== 'all') params.set('status', value);
    else if (filters.status && key !== 'status') params.set('status', filters.status);
    if (key === 'category' && value !== 'all') params.set('category', value);
    else if (filters.category && key !== 'category') params.set('category', filters.category);
    if (key === 'sort') params.set('sort', value);
    else if (filters.sort && key !== 'sort') params.set('sort', filters.sort);

    startTransition(() => {
      router.push(`/admin/products?${params.toString()}`);
    });
  };

  const handleStatusChange = async (productId: string, newStatus: 'draft' | 'active' | 'hidden' | 'archived') => {
    const supabase = createClient();

    const { error } = await supabase
      .from('products')
      .update({ status: newStatus })
      .eq('id', productId);

    if (error) {
      toast({
        title: '상태 변경 실패',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: '상태 변경 완료',
      description: '상품 상태가 변경되었습니다.',
    });

    router.refresh();
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`"${productName}" 상품을 삭제하시겠습니까?`)) {
      return;
    }

    const supabase = createClient();

    const { error } = await supabase
      .from('products')
      .update({ status: 'archived' })
      .eq('id', productId);

    if (error) {
      toast({
        title: '삭제 실패',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: '삭제 완료',
      description: '상품이 보관함으로 이동되었습니다.',
    });

    router.refresh();
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-neo-white border-3 border-neo-black p-4 shadow-neo">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neo-black/60" strokeWidth={2.5} />
              <input
                type="search"
                placeholder="상품명 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 bg-neo-white border-3 border-neo-black font-medium text-sm text-neo-black placeholder:text-neo-black/40 focus:outline-none focus:ring-2 focus:ring-neo-blue"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isPending}
              className="px-4 py-2 bg-neo-blue text-neo-white border-3 border-neo-black font-bold text-sm uppercase hover:bg-neo-blue/80 transition-colors disabled:opacity-50"
            >
              검색
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-neo-black" strokeWidth={2.5} />

            {/* Status Filter */}
            <select
              value={filters.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 bg-neo-white border-3 border-neo-black font-bold text-xs uppercase focus:outline-none"
            >
              <option value="all">전체 상태</option>
              <option value="draft">임시 저장</option>
              <option value="active">판매 중</option>
              <option value="hidden">숨김</option>
              <option value="archived">보관</option>
            </select>

            {/* Category Filter */}
            <select
              value={filters.category || 'all'}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-3 py-2 bg-neo-white border-3 border-neo-black font-bold text-xs uppercase focus:outline-none"
            >
              <option value="all">전체 카테고리</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={filters.sort || 'newest'}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-3 py-2 bg-neo-white border-3 border-neo-black font-bold text-xs uppercase focus:outline-none"
            >
              <option value="newest">최신순</option>
              <option value="popular">인기순</option>
              <option value="price_asc">가격 낮은순</option>
              <option value="price_desc">가격 높은순</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      {products.length === 0 ? (
        <div className="border-3 border-dashed border-neo-black/30 p-12 text-center">
          <Package className="w-12 h-12 text-neo-black/30 mx-auto mb-4" strokeWidth={2} />
          <p className="text-neo-black/60 font-bold">등록된 상품이 없습니다</p>
          <p className="text-neo-black/40 text-sm mt-2">첫 번째 상품을 등록해보세요.</p>
        </div>
      ) : (
        <div className="border-3 border-neo-black overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-neo-black text-neo-white">
                <th className="px-4 py-3 text-left font-black uppercase text-sm">상품명</th>
                <th className="px-4 py-3 text-left font-black uppercase text-sm">카테고리</th>
                <th className="px-4 py-3 text-right font-black uppercase text-sm">가격</th>
                <th className="px-4 py-3 text-center font-black uppercase text-sm">상태</th>
                <th className="px-4 py-3 text-center font-black uppercase text-sm">판매수</th>
                <th className="px-4 py-3 text-left font-black uppercase text-sm">등록일</th>
                <th className="px-4 py-3 text-center font-black uppercase text-sm">액션</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const statusStyle = STATUS_STYLES[product.status] || STATUS_STYLES.draft;

                return (
                  <tr
                    key={product.id}
                    className={`border-t-2 border-neo-black hover:bg-neo-cream/50 transition-colors ${
                      index % 2 === 0 ? 'bg-neo-white' : 'bg-neo-cream/30'
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="font-bold text-neo-black">{product.name}</div>
                      {product.is_featured && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-neo-yellow border-2 border-neo-black text-xs font-bold uppercase">
                          추천
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {product.category?.name || '-'}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {product.discount_price ? (
                        <div>
                          <div className="line-through text-neo-black/40 text-sm">
                            {formatCurrency(product.price)}
                          </div>
                          <div className="font-bold text-neo-pink">
                            {formatCurrency(product.discount_price)}
                          </div>
                        </div>
                      ) : (
                        <span className="font-bold">{formatCurrency(product.price)}</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <select
                        value={product.status}
                        onChange={(e) => handleStatusChange(product.id, e.target.value as any)}
                        className={`px-2 py-1 border-2 border-neo-black font-bold text-xs uppercase ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        <option value="draft">임시 저장</option>
                        <option value="active">판매 중</option>
                        <option value="hidden">숨김</option>
                        <option value="archived">보관</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-center font-bold">
                      {product.sales_count}건
                    </td>
                    <td className="px-4 py-4 text-sm text-neo-black/70">
                      {formatDate(product.created_at)}
                    </td>
                    <td className="px-4 py-4 text-center relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === product.id ? null : product.id)}
                        className="inline-flex items-center justify-center w-8 h-8 bg-neo-cream border-2 border-neo-black hover:bg-neo-yellow transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" strokeWidth={2.5} />
                      </button>

                      {openDropdown === product.id && (
                        <div className="absolute right-4 top-full mt-1 z-10 bg-neo-white border-3 border-neo-black shadow-neo min-w-[120px]">
                          <button
                            onClick={() => {
                              setOpenDropdown(null);
                              router.push(`/admin/products/${product.id}/edit`);
                            }}
                            className="w-full px-4 py-2 text-left font-bold text-sm flex items-center gap-2 hover:bg-neo-cream"
                          >
                            <Edit className="w-4 h-4" strokeWidth={2.5} />
                            수정
                          </button>
                          <button
                            onClick={() => {
                              setOpenDropdown(null);
                              handleDelete(product.id, product.name);
                            }}
                            className="w-full px-4 py-2 text-left font-bold text-sm flex items-center gap-2 hover:bg-neo-pink text-neo-pink hover:text-neo-black border-t-2 border-neo-black"
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                            삭제
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            disabled={pagination.page === 1 || isPending}
            onClick={() => {
              const params = new URLSearchParams();
              params.set('page', String(pagination.page - 1));
              if (filters.search) params.set('search', filters.search);
              if (filters.status) params.set('status', filters.status);
              if (filters.category) params.set('category', filters.category);
              if (filters.sort) params.set('sort', filters.sort);
              router.push(`/admin/products?${params.toString()}`);
            }}
            className="px-3 py-2 bg-neo-white border-3 border-neo-black font-bold text-sm uppercase hover:bg-neo-cream disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            이전
          </button>

          <span className="px-4 py-2 bg-neo-black text-neo-white font-bold text-sm">
            {pagination.page} / {pagination.totalPages}
          </span>

          <button
            disabled={pagination.page === pagination.totalPages || isPending}
            onClick={() => {
              const params = new URLSearchParams();
              params.set('page', String(pagination.page + 1));
              if (filters.search) params.set('search', filters.search);
              if (filters.status) params.set('status', filters.status);
              if (filters.category) params.set('category', filters.category);
              if (filters.sort) params.set('sort', filters.sort);
              router.push(`/admin/products?${params.toString()}`);
            }}
            className="px-3 py-2 bg-neo-white border-3 border-neo-black font-bold text-sm uppercase hover:bg-neo-cream disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            다음
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="text-center">
        <span className="inline-block px-4 py-2 bg-neo-cream border-3 border-neo-black font-bold text-sm">
          총 {pagination.total}개의 상품
        </span>
      </div>
    </div>
  );
}
