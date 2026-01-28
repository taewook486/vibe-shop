/**
 * P4-T4.3: 관리자 상품 이미지 API
 *
 * POST /api/admin/products/[id]/images - 이미지 업로드
 *
 * 권한: 관리자 전용
 * 기능: 다중 이미지 업로드, Supabase Storage 연동
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { checkAdminRole } from '@/lib/middleware/admin';
import { z } from 'zod';

// ============================================================================
// POST /api/admin/products/[id]/images - 이미지 업로드
// ============================================================================

/**
 * 이미지 업로드 스키마
 */
const uploadImagesSchema = z.object({
  images: z.array(
    z.object({
      url: z.string().url(),
      alt_text: z.string().max(200).optional(),
      is_primary: z.boolean().default(false),
      sort_order: z.number().int().min(0).default(0),
    })
  ),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;

    // 1. 인증 및 권한 체크 (NextAuth)
    const adminCheck = await checkAdminRole();
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: '관리자 권한이 필요합니다.',
          },
        },
        { status: 403 }
      );
    }

    const supabase = await createServerClient();

    // 2. 상품 존재 확인
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', resolvedParams.id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: '상품을 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    // 3. 요청 바디 검증
    const body = await request.json();
    const validated = uploadImagesSchema.parse(body);

    // 4. 기존 대표 이미지 해제 (새로운 대표 이미지가 있는 경우)
    const hasPrimary = validated.images.some((img) => img.is_primary);
    if (hasPrimary) {
      await supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', resolvedParams.id)
        .eq('is_primary', true);
    }

    // 5. 이미지 삽입
    const imagesToInsert = validated.images.map((img) => ({
      product_id: resolvedParams.id,
      url: img.url,
      alt_text: img.alt_text || null,
      is_primary: img.is_primary,
      sort_order: img.sort_order,
    }));

    const { data: images, error } = await supabase
      .from('product_images')
      .insert(imagesToInsert)
      .select();

    if (error) {
      console.error('Image upload error:', error);
      return NextResponse.json(
        {
          error: {
            code: 'UPLOAD_ERROR',
            message: error.message,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: images,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: '입력값이 올바르지 않습니다.',
            details: error.issues,
          },
        },
        { status: 400 }
      );
    }

    console.error('Unexpected error:', error);
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

// ============================================================================
// DELETE /api/admin/products/[id]/images - 이미지 삭제
// ============================================================================

/**
 * 이미지 삭제 스키마
 */
const deleteImagesSchema = z.object({
  image_ids: z.array(z.string().uuid()),
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;

    // 1. 인증 및 권한 체크 (NextAuth)
    const adminCheck = await checkAdminRole();
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: '관리자 권한이 필요합니다.',
          },
        },
        { status: 403 }
      );
    }

    const supabase = await createServerClient();

    // 2. 요청 바디 검증
    const body = await request.json();
    const validated = deleteImagesSchema.parse(body);

    // 3. 이미지 삭제
    const { error } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', resolvedParams.id)
      .in('id', validated.image_ids);

    if (error) {
      console.error('Image delete error:', error);
      return NextResponse.json(
        {
          error: {
            code: 'DELETE_ERROR',
            message: error.message,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        message: '이미지가 삭제되었습니다.',
        deleted_count: validated.image_ids.length,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: '입력값이 올바르지 않습니다.',
            details: error.issues,
          },
        },
        { status: 400 }
      );
    }

    console.error('Unexpected error:', error);
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
