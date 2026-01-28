/**
 * Categories API Route
 *
 * GET /api/categories
 * - 전체 카테고리 트리 반환 (계층형 구조)
 * - 비활성 카테고리 제외 (is_active = true)
 * - 각 카테고리별 상품 수 포함
 * - RLS 정책 자동 적용 (활성 카테고리만 조회 가능)
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_count?: number;
  children?: Category[];
}

interface Product {
  id: string;
  category_id: string;
  status: string;
}

export async function GET() {
  try {
    const supabase = await createServerClient();

    // 1. 활성 카테고리 모두 조회
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (categoriesError) {
      return NextResponse.json(
        {
          error: {
            code: 'FETCH_ERROR',
            message: categoriesError.message,
          },
        },
        { status: 500 }
      );
    }

    if (!categories) {
      return NextResponse.json({ categories: [] });
    }

    // 2. 활성 상품 목록 조회 (상품 수 계산용)
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, category_id, status')
      .eq('status', 'active');

    if (productsError) {
      return NextResponse.json(
        {
          error: {
            code: 'FETCH_ERROR',
            message: productsError.message,
          },
        },
        { status: 500 }
      );
    }

    // 3. 카테고리별 상품 수 계산
    const productCountMap = new Map<string, number>();
    (products || []).forEach((product) => {
      if (product.category_id) {
        const count = productCountMap.get(product.category_id) || 0;
        productCountMap.set(product.category_id, count + 1);
      }
    });

    // 4. 카테고리에 상품 수 추가
    const categoriesWithCount: Category[] = categories.map((category) => ({
      ...category,
      product_count: productCountMap.get(category.id) || 0,
    }));

    // 5. 계층형 트리 구조 생성
    const categoryTree = buildCategoryTree(categoriesWithCount);

    return NextResponse.json({ categories: categoryTree });
  } catch (error) {
    console.error('Categories API Error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch categories',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * 카테고리 배열을 계층형 트리 구조로 변환
 *
 * @param categories - 평면 카테고리 배열
 * @returns 계층형 카테고리 트리
 */
function buildCategoryTree(categories: Category[]): Category[] {
  // 카테고리 ID를 키로 하는 맵 생성
  const categoryMap = new Map<string, Category>();
  const rootCategories: Category[] = [];

  // 모든 카테고리를 맵에 저장하고 children 배열 초기화
  categories.forEach((category) => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  // 부모-자식 관계 설정
  categories.forEach((category) => {
    const categoryWithChildren = categoryMap.get(category.id);
    if (!categoryWithChildren) return;

    if (category.parent_id === null) {
      // 최상위 카테고리
      rootCategories.push(categoryWithChildren);
    } else {
      // 하위 카테고리
      const parent = categoryMap.get(category.parent_id);
      if (parent && parent.children) {
        parent.children.push(categoryWithChildren);
      }
    }
  });

  // 하위 카테고리를 sort_order로 정렬
  const sortChildren = (cats: Category[]) => {
    cats.forEach((cat) => {
      if (cat.children && cat.children.length > 0) {
        cat.children.sort((a, b) => a.sort_order - b.sort_order);
        sortChildren(cat.children);
      }
    });
  };

  sortChildren(rootCategories);

  return rootCategories;
}
