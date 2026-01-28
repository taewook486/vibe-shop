import { ProductCard } from '@/components/products/product-card';
import type { Product } from '@/types/product';

// ============================================================================
// Demo Data
// ============================================================================

const baseProduct: Product = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  category_id: null,
  name: '바이브코딩 강의 패키지',
  slug: 'vibecoding-course-package',
  short_description: 'AI와 함께하는 코딩 강의',
  description: null,
  price: 99000,
  discount_price: null,
  type: 'digital',
  metadata: null,
  status: 'active',
  is_featured: false,
  view_count: 0,
  sales_count: 0,
  created_at: '2026-01-25T00:00:00Z',
  updated_at: '2026-01-25T00:00:00Z',
};

const demoProducts = {
  default: {
    product: baseProduct,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
  },
  discount: {
    product: {
      ...baseProduct,
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Next.js 15 마스터 클래스',
      slug: 'nextjs-15-masterclass',
      price: 149000,
      discount_price: 99000,
    },
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  },
  noImage: {
    product: {
      ...baseProduct,
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'TypeScript 완벽 가이드',
      slug: 'typescript-complete-guide',
      price: 79000,
    },
    thumbnail: undefined,
  },
  longTitle: {
    product: {
      ...baseProduct,
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: '이것은 매우 긴 상품명으로 카드 내에서 적절히 잘려야 하는 텍스트입니다 아주 길게 작성해봅니다 정말 긴 제목',
      slug: 'long-title-product',
      price: 59000,
      discount_price: 39000,
    },
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
  },
};

// ============================================================================
// Demo Page
// ============================================================================

export default function ProductCardDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 p-8">
      {/* Header */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            ProductCard Component Demo
          </h1>
          <p className="text-lg text-gray-600">
            Phase 2 - Task 2.3: 상품 카드 컴포넌트 (Neo-Brutalism 스타일)
          </p>
        </div>

        {/* Demo Grid */}
        <div className="space-y-12">
          {/* Default State */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              1. Default State
            </h2>
            <p className="mb-6 text-gray-600">
              기본 상품 카드 (썸네일, 상품명, 가격)
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <ProductCard
                product={demoProducts.default.product}
                thumbnail={demoProducts.default.thumbnail}
              />
            </div>
          </section>

          {/* Discount State */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              2. Discount State
            </h2>
            <p className="mb-6 text-gray-600">
              할인가 적용 (원가 취소선, 할인율 뱃지)
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <ProductCard
                product={demoProducts.discount.product}
                thumbnail={demoProducts.discount.thumbnail}
              />
            </div>
          </section>

          {/* No Image State */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              3. No Image State
            </h2>
            <p className="mb-6 text-gray-600">
              썸네일 없을 때 placeholder 표시
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <ProductCard
                product={demoProducts.noImage.product}
                thumbnail={demoProducts.noImage.thumbnail}
              />
            </div>
          </section>

          {/* Long Title State */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              4. Long Title State
            </h2>
            <p className="mb-6 text-gray-600">
              긴 상품명은 2줄로 제한 (line-clamp-2)
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <ProductCard
                product={demoProducts.longTitle.product}
                thumbnail={demoProducts.longTitle.thumbnail}
              />
            </div>
          </section>

          {/* All States Combined */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              5. All States Combined
            </h2>
            <p className="mb-6 text-gray-600">
              모든 상태를 한눈에 비교
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <ProductCard
                product={demoProducts.default.product}
                thumbnail={demoProducts.default.thumbnail}
              />
              <ProductCard
                product={demoProducts.discount.product}
                thumbnail={demoProducts.discount.thumbnail}
              />
              <ProductCard
                product={demoProducts.noImage.product}
                thumbnail={demoProducts.noImage.thumbnail}
              />
              <ProductCard
                product={demoProducts.longTitle.product}
                thumbnail={demoProducts.longTitle.thumbnail}
              />
            </div>
          </section>
        </div>

        {/* Features Checklist */}
        <div className="mt-12 rounded-lg border-4 border-black bg-white p-8 shadow-neo-xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Features Checklist
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <span>썸네일 이미지 (placeholder if null)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <span>상품명 (긴 텍스트 truncate, line-clamp-2)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <span>가격 표시 (원화 포맷)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <span>할인가 표시 (원가 취소선, 할인율 뱃지)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <span>호버 효과 (translate, shadow 변화)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <span>상품 상세 링크 (/products/[slug])</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <span>Neo-Brutalism 스타일 (border-4, shadow)</span>
            </li>
          </ul>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a
            href="/demo"
            className="inline-block rounded-lg border-4 border-black bg-blue-400 px-6 py-3 font-bold text-white shadow-neo transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo"
          >
            ← Back to Demo Home
          </a>
        </div>
      </div>
    </div>
  );
}
