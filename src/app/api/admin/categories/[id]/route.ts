import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { checkAdminRole } from '@/lib/middleware/admin';
import { z } from 'zod';

// Validation schema for category updates
const updateCategorySchema = z.object({
  name: z.string().min(1, '카테고리 이름은 필수입니다').optional(),
  slug: z.string().min(1, '슬러그는 필수입니다').regex(/^[a-z0-9-]+$/, '슬러그는 소문자, 숫자, 하이픈만 사용 가능합니다').optional(),
  description: z.string().optional().nullable(),
  parent_id: z.string().uuid().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  sort_order: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/admin/categories/[id]
 * 특정 카테고리 조회
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createServerClient();
    const { id } = await context.params;

    // Check admin role
    const adminCheck = await checkAdminRole(supabase);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: '관리자 권한이 필요합니다' } },
        { status: 403 }
      );
    }

    // Get category by id
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !category) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: '카테고리를 찾을 수 없습니다' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: category });
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/categories/[id]:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/categories/[id]
 * 카테고리 수정
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createServerClient();
    const { id } = await context.params;

    // Check admin role
    const adminCheck = await checkAdminRole(supabase);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: '관리자 권한이 필요합니다' } },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateCategorySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: '입력 데이터가 유효하지 않습니다',
            details: validationResult.error.issues,
          },
        },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Check if category exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingCategory) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: '카테고리를 찾을 수 없습니다' } },
        { status: 404 }
      );
    }

    // If slug is being updated, check for duplicates
    if (updateData.slug) {
      const { data: duplicateSlug } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', updateData.slug)
        .neq('id', id)
        .single();

      if (duplicateSlug) {
        return NextResponse.json(
          {
            error: {
              code: 'DUPLICATE_SLUG',
              message: '이미 존재하는 슬러그입니다',
            },
          },
          { status: 400 }
        );
      }
    }

    // If parent_id is being updated, verify it exists and prevent circular reference
    if (updateData.parent_id !== undefined) {
      if (updateData.parent_id === id) {
        return NextResponse.json(
          {
            error: {
              code: 'CIRCULAR_REFERENCE',
              message: '자기 자신을 상위 카테고리로 설정할 수 없습니다',
            },
          },
          { status: 400 }
        );
      }

      if (updateData.parent_id) {
        const { data: parentCategory } = await supabase
          .from('categories')
          .select('id')
          .eq('id', updateData.parent_id)
          .single();

        if (!parentCategory) {
          return NextResponse.json(
            {
              error: {
                code: 'PARENT_NOT_FOUND',
                message: '상위 카테고리를 찾을 수 없습니다',
              },
            },
            { status: 400 }
          );
        }
      }
    }

    // Update category
    const { data: updatedCategory, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: '카테고리 수정에 실패했습니다' } },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: updatedCategory });
  } catch (error) {
    console.error('Unexpected error in PATCH /api/admin/categories/[id]:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/categories/[id]
 * 카테고리 삭제
 * AC: 하위 카테고리가 있으면 삭제 방지
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createServerClient();
    const { id } = await context.params;

    // Check admin role
    const adminCheck = await checkAdminRole(supabase);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: '관리자 권한이 필요합니다' } },
        { status: 403 }
      );
    }

    // Check if category exists
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('id', id)
      .single();

    if (!category) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: '카테고리를 찾을 수 없습니다' } },
        { status: 404 }
      );
    }

    // Check if category has children
    const { data: children, error: childrenError } = await supabase
      .from('categories')
      .select('id')
      .eq('parent_id', id)
      .limit(1);

    if (childrenError) {
      console.error('Error checking children:', childrenError);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: '하위 카테고리 확인에 실패했습니다' } },
        { status: 500 }
      );
    }

    if (children && children.length > 0) {
      return NextResponse.json(
        {
          error: {
            code: 'HAS_CHILDREN',
            message: '하위 카테고리가 있어 삭제할 수 없습니다. 먼저 하위 카테고리를 삭제하거나 이동해주세요.',
          },
        },
        { status: 400 }
      );
    }

    // Check if category has products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', id)
      .limit(1);

    if (productsError) {
      console.error('Error checking products:', productsError);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: '상품 확인에 실패했습니다' } },
        { status: 500 }
      );
    }

    if (products && products.length > 0) {
      return NextResponse.json(
        {
          error: {
            code: 'HAS_PRODUCTS',
            message: '해당 카테고리에 상품이 있어 삭제할 수 없습니다. 먼저 상품을 삭제하거나 다른 카테고리로 이동해주세요.',
          },
        },
        { status: 400 }
      );
    }

    // Delete category
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting category:', deleteError);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: '카테고리 삭제에 실패했습니다' } },
        { status: 500 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/admin/categories/[id]:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}
