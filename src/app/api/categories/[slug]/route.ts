/**
 * Category by Slug API Route
 *
 * GET /api/categories/[slug]
 * - 특정 카테고리의 정보와 해당 카테고리의 상품 목록 반환
 * - 비활성 카테고리는 404 반환
 * - 활성 상품만 반환
 * - RLS 정책 자동 적용
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const supabase = await createServerClient();

    // 1. 카테고리 조회 (활성 상태만)
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .limit(1);

    if (categoryError) {
      return NextResponse.json(
        {
          error: {
            code: 'FETCH_ERROR',
            message: categoryError.message,
          },
        },
        { status: 500 }
      );
    }

    // 2. 카테고리가 없거나 비활성인 경우 404
    if (!categories || categories.length === 0) {
      return NextResponse.json(
        {
          error: {
            code: 'CATEGORY_NOT_FOUND',
            message: `Category with slug '${slug}' not found or inactive`,
          },
        },
        { status: 404 }
      );
    }

    const category = categories[0];

    // 3. 해당 카테고리의 활성 상품 조회
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(
        `
        id,
        name,
        slug,
        short_description,
        price,
        discount_price,
        type,
        is_featured,
        view_count,
        sales_count,
        created_at,
        product_images (
          id,
          url,
          alt,
          is_primary
        )
      `
      )
      .eq('category_id', category.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

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

    // 4. 각 상품의 대표 이미지 추출
    const productsWithPrimaryImage = (products || []).map((product: any) => {
      const primaryImage =
        product.product_images?.find((img: any) => img.is_primary) ||
        product.product_images?.[0];

      return {
        ...product,
        primary_image: primaryImage
          ? {
              id: primaryImage.id,
              url: primaryImage.url,
              alt: primaryImage.alt,
            }
          : null,
        product_images: undefined, // 원본 이미지 배열 제거 (불필요한 데이터)
      };
    });

    return NextResponse.json({
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image_url: category.image_url,
        product_count: products?.length || 0,
      },
      products: productsWithPrimaryImage,
    });
  } catch (error) {
    console.error('Category by Slug API Error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch category',
        },
      },
      { status: 500 }
    );
  }
}
