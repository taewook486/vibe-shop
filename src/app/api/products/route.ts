/**
 * Products API Route
 *
 * GET /api/products - 상품 목록 조회
 * - 페이지네이션 (page, limit)
 * - 필터 (category, minPrice, maxPrice, search)
 * - 정렬 (popular, newest, price_asc, price_desc)
 * - status=active만 노출
 * - 상품 이미지 포함
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// UUID 형식 체크 헬퍼
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const searchParams = request.nextUrl.searchParams;

    // 쿼리 파라미터 파싱
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice')
      ? parseInt(searchParams.get('minPrice')!)
      : undefined;
    const maxPrice = searchParams.get('maxPrice')
      ? parseInt(searchParams.get('maxPrice')!)
      : undefined;
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';

    // 카테고리 ID 조회 (slug인 경우)
    let categoryId: string | null = null;
    if (category) {
      if (isValidUUID(category)) {
        categoryId = category;
      } else {
        // slug로 카테고리 조회
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', category)
          .single();

        if (categoryData) {
          categoryId = categoryData.id;
        }
        // 카테고리를 찾지 못하면 빈 결과 반환
      }
    }

    // 쿼리 빌더 시작 - 이미지 포함
    let query = supabase
      .from('products')
      .select(`
        *,
        product_images (
          id,
          url,
          alt,
          is_primary,
          sort_order
        )
      `, { count: 'exact' })
      .eq('status', 'active');

    // 필터 적용
    if (category && categoryId) {
      query = query.eq('category_id', categoryId);
    } else if (category && !categoryId) {
      // 카테고리 slug가 잘못된 경우 빈 결과 반환
      return NextResponse.json({
        products: [],
        pagination: {
          page,
          pageSize,
          total: 0,
          totalPages: 0,
        },
      });
    }

    if (minPrice !== undefined) {
      query = query.gte('price', minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte('price', maxPrice);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // 정렬 적용
    switch (sort) {
      case 'popular':
        query = query.order('sales_count', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
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

    // 페이지네이션 적용
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    // 실행
    const { data: products, error, count } = await query;

    if (error) {
      console.error('Products fetch error:', error);
      return NextResponse.json(
        { error: { code: 'FETCH_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    // 응답 생성 - 이미지 처리
    const productsWithImages = (products || []).map((p: any) => {
      const images = p.product_images || [];
      // 대표 이미지 찾기 (is_primary=true 또는 첫번째 이미지)
      const primaryImage = images.find((img: any) => img.is_primary) || images[0];

      return {
        ...p,
        metadata: p.metadata as any,
        // 프론트엔드에서 사용할 이미지 필드 추가
        thumbnail: primaryImage?.url || null,
        images: images.map((img: any) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          is_primary: img.is_primary,
          sort_order: img.sort_order,
        })),
        // product_images 원본 필드 제거
        product_images: undefined,
      };
    });

    const response = {
      products: productsWithImages,
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
