/**
 * Product Reviews API Route
 *
 * GET /api/products/[slug]/reviews - 상품별 후기 목록 조회
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// ============================================================================
// Types
// ============================================================================

type SortOption = 'latest' | 'likes' | 'rating_high' | 'rating_low';

// ============================================================================
// GET /api/products/[slug]/reviews - 상품별 후기 목록 조회
// ============================================================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);

    // 쿼리 파라미터 파싱
    const sort = (searchParams.get('sort') || 'latest') as SortOption;
    const rating = searchParams.get('rating') ? parseInt(searchParams.get('rating')!) : null;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    const supabase = await createServerClient();

    // 1. 상품 조회
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, slug')
      .eq('slug', slug)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        {
          error: {
            code: 'PRODUCT_NOT_FOUND',
            message: '상품을 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    // 2. 후기 목록 조회
    let query = supabase
      .from('reviews')
      .select(
        `
        id,
        product_id,
        user_id,
        rating,
        title,
        content,
        images,
        like_count,
        view_count,
        is_best,
        created_at,
        updated_at,
        profiles:user_id (
          nickname,
          avatar_url
        )
      `,
        { count: 'exact' }
      )
      .eq('product_id', product.id);

    // 별점 필터
    if (rating) {
      query = query.eq('rating', rating);
    }

    // 정렬
    switch (sort) {
      case 'likes':
        query = query.order('like_count', { ascending: false });
        break;
      case 'rating_high':
        query = query.order('rating', { ascending: false });
        break;
      case 'rating_low':
        query = query.order('rating', { ascending: true });
        break;
      case 'latest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    // 페이지네이션
    const { data: reviews, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error('후기 목록 조회 실패:', error);
      return NextResponse.json(
        {
          error: {
            code: 'FETCH_ERROR',
            message: '후기 목록 조회에 실패했습니다.',
          },
        },
        { status: 500 }
      );
    }

    // 3. 평균 별점 계산
    const { data: avgData } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', product.id);

    let averageRating = 0;
    let totalReviews = 0;

    if (avgData && avgData.length > 0) {
      totalReviews = avgData.length;
      const sum = avgData.reduce((acc, r) => acc + r.rating, 0);
      averageRating = Math.round((sum / totalReviews) * 10) / 10; // 소수점 1자리
    }

    // 4. 별점 분포 계산
    const { data: distributionData } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', product.id);

    const ratingDistribution = [
      { rating: 5, count: 0 },
      { rating: 4, count: 0 },
      { rating: 3, count: 0 },
      { rating: 2, count: 0 },
      { rating: 1, count: 0 },
    ];

    if (distributionData) {
      distributionData.forEach((r) => {
        const dist = ratingDistribution.find((d) => d.rating === r.rating);
        if (dist) dist.count++;
      });
    }

    return NextResponse.json(
      {
        product,
        reviews: reviews || [],
        stats: {
          total_reviews: totalReviews,
          average_rating: averageRating,
          rating_distribution: ratingDistribution,
        },
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('상품별 후기 조회 중 예외 발생:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: '서버 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}
