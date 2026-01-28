/**
 * Product Detail API Route
 *
 * GET /api/products/[slug] - 상품 상세 조회
 * - 이미지, 미리보기 파일, 태그 포함
 * - status=active만 노출
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { ProductDetailResponse, ProductWithAll } from '@/types/product';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const supabase = await createServerClient();

    // 상품 조회 (status=active만)
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Product not found' } },
        { status: 404 }
      );
    }

    // 이미지 조회
    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', product.id)
      .order('sort_order', { ascending: true });

    if (imagesError) {
      console.error('[Product API] Images fetch error:', imagesError);
      // 이미지 조회 실패 시 빈 배열로 계속
    }

    // 미리보기 파일만 조회 (is_preview=true)
    let files: any[] = [];
    try {
      const { data: filesData, error: filesError } = await supabase
        .from('product_files')
        .select('*')
        .eq('product_id', product.id)
        .eq('is_preview', true);

      if (!filesError && filesData) {
        files = filesData;
      }
    } catch (error) {
      console.error('[Product API] Files fetch error:', error);
      // 파일 조회 실패 시 빈 배열로 계속
    }

    // 태그 조회 (product_tags를 통해 조인)
    let tags: any[] = [];
    try {
      const { data: productTags, error: tagsError } = await supabase
        .from('product_tags')
        .select('tag_id, tags(id, name, slug)')
        .eq('product_id', product.id);

      if (!tagsError && productTags) {
        tags = productTags
          .map((pt: any) => pt.tags)
          .filter((tag: any) => tag !== null);
      }
    } catch (error) {
      console.error('[Product API] Tags fetch error:', error);
      // 태그 조회 실패 시 빈 배열로 계속
    }

    // 응답 생성 (metadata 타입 캐스팅)
    const productWithAll = {
      ...product,
      type: 'digital' as const, // Default type for digital products store
      metadata: product.metadata as any,
      images: images || [],
      files: (files || []) as any,
      tags: tags || [],
    } as ProductWithAll;

    const response: ProductDetailResponse = {
      product: productWithAll,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Product API Error]', {
      slug,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
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
