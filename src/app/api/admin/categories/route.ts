import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { checkAdminRole } from '@/lib/middleware/admin';
import { z } from 'zod';

// Validation schema for category creation
const createCategorySchema = z.object({
  name: z.string().min(1, '카테고리 이름은 필수입니다'),
  slug: z.string().min(1, '슬러그는 필수입니다').regex(/^[a-z0-9-]+$/, '슬러그는 소문자, 숫자, 하이픈만 사용 가능합니다'),
  description: z.string().optional(),
  parent_id: z.string().uuid().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

/**
 * GET /api/admin/categories
 * 관리자용 카테고리 전체 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // Check admin role
    const adminCheck = await checkAdminRole(supabase);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: '관리자 권한이 필요합니다' } },
        { status: 403 }
      );
    }

    // Get all categories (including inactive ones)
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: '카테고리 조회에 실패했습니다' } },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/categories:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/categories
 * 새 카테고리 생성
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();

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
    const validationResult = createCategorySchema.safeParse(body);

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

    const categoryData = validationResult.data;

    // Check for duplicate slug
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categoryData.slug)
      .single();

    if (existingCategory) {
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

    // If parent_id is provided, verify it exists
    if (categoryData.parent_id) {
      const { data: parentCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('id', categoryData.parent_id)
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

    // Create category
    const { data: newCategory, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: '카테고리 생성에 실패했습니다' } },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: newCategory }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/categories:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다' } },
      { status: 500 }
    );
  }
}
