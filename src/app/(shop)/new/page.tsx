'use client';

/**
 * New Products Page
 *
 * 최근 30일 내 등록된 신규 상품 페이지
 * - Neo-Brutalism 스타일
 * - ProductCard 재사용
 * - 상위 12개 상품만 표시 (페이지네이션 없음)
 */

import { ProductCard } from '@/components/products/product-card';
import { useProducts } from '@/hooks/use-products';
import type { Product } from '@/types/product';

// ============================================================================
// Utilities
// ============================================================================

/**
 * 상품 썸네일 추출 헬퍼
 */
const getProductThumbnail = (product: Product & { images?: Array<{ url: string } | string>; thumbnail?: string }): string | undefined => {
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

// ============================================================================
// Component
// ============================================================================

export default function NewProductsPage() {
  const { products, isLoading, error } = useProducts({
    sort: 'newest',
    pageSize: 12,
  });

  return (
    <div className="min-h-screen bg-neo-cream py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black text-neo-black uppercase tracking-tight border-b-4 border-neo-black pb-4 inline-block">
            신규 상품
          </h1>
          <p className="text-lg text-neo-black/70 mt-4 font-bold">
            최근 등록된 따끈따끈한 상품들을 만나보세요
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              data-testid="loading-spinner"
              className="h-16 w-16 animate-spin rounded-full border-4 border-neo-black border-t-transparent"
            />
            <p className="mt-4 text-lg font-bold text-neo-black">
              상품을 불러오는 중...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div
            data-testid="error-message"
            className="rounded-none border-4 border-neo-pink bg-neo-white p-8 text-center shadow-neo"
          >
            <p className="text-2xl font-black text-neo-pink uppercase">
              오류 발생!
            </p>
            <p className="mt-2 text-neo-black font-bold">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-neo-pink text-neo-white font-black uppercase px-6 py-3 border-2 border-neo-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <div
            data-testid="empty-state"
            className="rounded-none border-4 border-neo-black bg-neo-white p-12 text-center shadow-neo"
          >
            <svg
              className="mx-auto h-24 w-24 text-neo-black/20 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-3xl font-black text-neo-black uppercase">
              신규 상품이 없습니다
            </p>
            <p className="mt-3 text-lg text-neo-black/60 font-bold">
              곧 새로운 상품이 추가될 예정입니다
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && products.length > 0 && (
          <div
            data-testid="products-grid"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                thumbnail={getProductThumbnail(product)}
              />
            ))}
          </div>
        )}

        {/* Footer Note */}
        {!isLoading && !error && products.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm text-neo-black/50 font-bold">
              총 {products.length}개의 신규 상품
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
