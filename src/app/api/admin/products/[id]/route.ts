/**
 * P4-T4.3: 관리자 상품 API - 상세/수정/삭제
 *
 * GET /api/admin/products/[id] - 상품 상세 조회
 * PATCH /api/admin/products/[id] - 상품 수정
 * DELETE /api/admin/products/[id] - 상품 삭제 (Soft delete)
 *
 * 권한: 관리자 전용
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { checkAdminRole } from '@/lib/middleware/admin';
import { z } from 'zod';

// ============================================================================
// GET /api/admin/products/[id] - 상품 상세 조회
// ============================================================================

export async function GET(
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

    // 2. Supabase 클라이언트 생성 (DB 접근용)
    const supabase = await createServerClient();

    // 2. 상품 조회 (이미지, 파일, 태그 포함)
    const { data: product, error } = await supabase
      .from('products')
      .select(
        `
        *,
        category:categories(id, name, slug),
        images:product_images(*),
        files:product_files(*),
        tags:product_tags(tag:tags(*))
      `
      )
      .eq('id', resolvedParams.id)
      .single();

    if (error || !product) {
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

    return NextResponse.json({
      data: product,
    });
  } catch (error) {
    console.error('Product detail error:', error);
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
// PATCH /api/admin/products/[id] - 상품 수정
// ============================================================================

/**
 * 상품 수정 스키마
 */
const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only')
    .optional(),
  short_description: z.string().max(300).nullable().optional(),
  description: z.string().nullable().optional(),
  price: z.number().int().min(0).optional(),
  discount_price: z.number().int().min(0).nullable().optional(),
  category_id: z.string().uuid().nullable().optional(),
  status: z.enum(['draft', 'active', 'archived', 'hidden']).optional(),
  is_featured: z.boolean().optional(),
  metadata: z.any().nullable().optional(),
});

export async function PATCH(
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

    // 2. Supabase 클라이언트 생성 (DB 접근용)
    const supabase = await createServerClient();

    // 2. 요청 바디 검증
    const body = await request.json();
    const validated = updateProductSchema.parse(body);

    // 3. 상품 수정
    const updateData: any = {
      ...validated,
      updated_at: new Date().toISOString(),
    };

    if (validated.metadata !== undefined) {
      updateData.metadata = validated.metadata as any;
    }

    const { data: product, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', resolvedParams.id)
      .select()
      .single();

    if (error || !product) {
      return NextResponse.json(
        {
          error: {
            code: 'UPDATE_ERROR',
            message: error?.message || '상품 수정에 실패했습니다.',
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: product,
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

    console.error('Product update error:', error);
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
// DELETE /api/admin/products/[id] - 상품 삭제 (Soft delete)
// ============================================================================

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

    // 2. Supabase 클라이언트 생성 (DB 접근용)
    const supabase = await createServerClient();

    // 2. Soft delete (status를 'archived'로 변경)
    const { data: product, error } = await supabase
      .from('products')
      .update({
        status: 'archived',
        updated_at: new Date().toISOString(),
      })
      .eq('id', resolvedParams.id)
      .select()
      .single();

    if (error || !product) {
      return NextResponse.json(
        {
          error: {
            code: 'DELETE_ERROR',
            message: error?.message || '상품 삭제에 실패했습니다.',
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        id: product.id,
        message: '상품이 보관 처리되었습니다.',
      },
    });
  } catch (error) {
    console.error('Product delete error:', error);
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
