'use client';

/**
 * Products Page
 *
 * P2-T2.4: 상품 목록 페이지
 * - 반응형 그리드 레이아웃 (1/2/3/4 cols)
 * - 카테고리 필터 (사이드바)
 * - 정렬 옵션 (인기순/최신순/가격순)
 * - 페이지네이션
 */

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/products/product-card';
import { useProducts } from '@/hooks/use-products';
import type { ProductsParams } from '@/types/products';
import type { CategoryFull } from '@/types/category';
import { Button } from '@/components/ui/button';

// ============================================================================
// Types
// ============================================================================

type SortOption = 'popular' | 'newest' | 'price_asc' | 'price_desc';

// ============================================================================
// Helpers
// ============================================================================

/**
 * Get effective price (discount_price if available, otherwise price)
 */
function getEffectivePrice(product: any): number {
  return product.discount_price ?? product.price ?? 0;
}

// ============================================================================
// Component
// ============================================================================

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  const [params, setParams] = useState<ProductsParams>({
    page: 1,
    pageSize: 12,
    sort: 'popular',
    category: categoryFromUrl || undefined,
  });

  const [categories, setCategories] = useState<CategoryFull[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryFromUrl);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // URL 파라미터 변경 시 카테고리 업데이트
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
    setParams((prev) => ({
      ...prev,
      category: categoryFromUrl || undefined,
      page: 1,
    }));
  }, [categoryFromUrl]);

  const { products, pagination, isLoading, error } = useProducts(params);

  // Client-side sort by effective price (discount_price ?? price)
  const sortedProducts = useMemo(() => {
    if (!products || products.length === 0) return products;

    // Only apply client-side sorting for price options
    if (params.sort === 'price_asc') {
      return [...products].sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    }
    if (params.sort === 'price_desc') {
      return [...products].sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    }

    // For other sort options, use API-sorted order
    return products;
  }, [products, params.sort]);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setIsLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  // Handle category filter
  const handleCategoryChange = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug);
    setParams((prev) => ({
      ...prev,
      category: categorySlug || undefined,
      page: 1, // Reset to first page
    }));
  };

  // Handle sort change
  const handleSortChange = (sort: SortOption) => {
    setParams((prev) => ({
      ...prev,
      sort,
      page: 1, // Reset to first page
    }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setParams((prev) => ({
      ...prev,
      page,
    }));
  };

  // Get primary image URL
  const getProductThumbnail = (product: any): string | undefined => {
    // API에서 직접 thumbnail 필드를 제공하는 경우
    if (product.thumbnail) {
      return product.thumbnail;
    }
    // images 배열에서 추출
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      // 이미지가 객체인 경우 url 필드 추출
      if (typeof firstImage === 'object' && firstImage.url) {
        return firstImage.url;
      }
      // 문자열인 경우 그대로 반환
      if (typeof firstImage === 'string') {
        return firstImage;
      }
    }
    return undefined;
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Category Filter */}
      <aside
        role="complementary"
        className="hidden w-64 shrink-0 border-r-4 border-black bg-white p-6 lg:block"
      >
        <h2 className="mb-6 text-xl font-bold">카테고리</h2>

        {isLoadingCategories ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
          </div>
        ) : (
          <ul className="space-y-2">
            {/* All categories */}
            <li>
              <button
                onClick={() => handleCategoryChange(null)}
                data-testid="category-all"
                className={`w-full rounded-lg border-2 border-black px-4 py-2 text-left font-bold transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-500 text-white'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                전체
              </button>
            </li>

            {/* Category list */}
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`w-full rounded-lg border-2 border-black px-4 py-2 text-left font-bold transition-colors ${
                    selectedCategory === category.slug
                      ? 'bg-blue-500 text-white'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className="ml-2 text-sm opacity-70">
                    ({category.product_count})
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Main Content */}
      <main role="main" className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">상품 목록</h1>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="font-bold">
              정렬:
            </label>
            <select
              id="sort-select"
              role="combobox"
              aria-label="정렬"
              value={params.sort || 'popular'}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="rounded-lg border-2 border-black bg-white px-4 py-2 font-bold shadow-neo transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-neo-sm"
            >
              <option value="popular">인기순</option>
              <option value="newest">최신순</option>
              <option value="price_asc">가격 낮은순</option>
              <option value="price_desc">가격 높은순</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div
              data-testid="loading-spinner"
              className="h-16 w-16 animate-spin rounded-full border-4 border-black border-t-transparent"
            ></div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="rounded-lg border-4 border-red-500 bg-red-50 p-8 text-center">
            <p className="text-xl font-bold text-red-700">
              상품을 불러오는데 실패했습니다
            </p>
            <p className="mt-2 text-red-600">{error.message}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && sortedProducts.length === 0 && (
          <div className="rounded-lg border-4 border-black bg-gray-50 p-12 text-center">
            <p className="text-2xl font-bold text-gray-700">상품이 없습니다</p>
            <p className="mt-2 text-gray-600">
              {selectedCategory
                ? '다른 카테고리를 선택해보세요'
                : '곧 새로운 상품이 추가될 예정입니다'}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && sortedProducts.length > 0 && (
          <>
            <div
              data-testid="products-grid"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  thumbnail={getProductThumbnail(product)}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <nav
                role="navigation"
                aria-label="페이지네이션"
                className="mt-12 flex items-center justify-center gap-2"
              >
                {/* Previous Button */}
                <Button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  variant="outline"
                  className="border-2 border-black font-bold shadow-neo disabled:opacity-50"
                >
                  이전
                </Button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first, last, current, and adjacent pages
                      return (
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - pagination.page) <= 1
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const showEllipsis =
                        index > 0 && page - array[index - 1] > 1;

                      return (
                        <div key={page} className="flex gap-2">
                          {showEllipsis && <span className="px-2">...</span>}
                          <Button
                            onClick={() => handlePageChange(page)}
                            variant={
                              page === pagination.page ? 'default' : 'outline'
                            }
                            className={`min-w-[44px] border-2 border-black font-bold shadow-neo ${
                              page === pagination.page
                                ? 'bg-blue-500 text-white'
                                : 'bg-white'
                            }`}
                          >
                            {page}
                          </Button>
                        </div>
                      );
                    })}
                </div>

                {/* Next Button */}
                <Button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  variant="outline"
                  className="border-2 border-black font-bold shadow-neo disabled:opacity-50"
                >
                  다음
                </Button>
              </nav>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
