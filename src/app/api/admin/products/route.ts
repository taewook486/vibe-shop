/**
 * P4-T4.3: 관리자 상품 API - 목록/생성
 *
 * POST /api/admin/products - 상품 생성
 * GET /api/admin/products - 상품 목록 조회 (관리자용, 모든 상태 포함)
 *
 * 권한: 관리자 전용
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { checkAdminRole } from '@/lib/middleware/admin';
import { z } from 'zod';

// ============================================================================
// POST /api/admin/products - 상품 생성
// ============================================================================

/**
 * 상품 생성 스키마
 */
const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only')
    .optional(),
  short_description: z.string().max(300).nullable().optional(),
  description: z.string().nullable().optional(),
  price: z.number().int().min(0),
  discount_price: z.number().int().min(0).nullable().optional(),
  category_id: z.string().uuid().nullable().optional(),
  status: z.enum(['draft', 'active', 'archived', 'hidden']).default('draft'),
  is_featured: z.boolean().default(false),
  metadata: z.any().nullable().optional(),
});

/**
 * 한글 → 영문 슬러그 변환
 */
function generateSlug(name: string): string {
  // 한글 자음/모음 분리 (간단한 로마자 변환)
  const koreanToRoman: Record<string, string> = {
    'ㄱ': 'g', 'ㄴ': 'n', 'ㄷ': 'd', 'ㄹ': 'r', 'ㅁ': 'm',
    'ㅂ': 'b', 'ㅅ': 's', 'ㅇ': '', 'ㅈ': 'j', 'ㅊ': 'ch',
    'ㅋ': 'k', 'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 'h',
    '가': 'ga', '나': 'na', '다': 'da', '라': 'ra', '마': 'ma',
    '바': 'ba', '사': 'sa', '아': 'a', '자': 'ja', '차': 'cha',
    '카': 'ka', '타': 'ta', '파': 'pa', '하': 'ha',
  };

  let slug = name.toLowerCase();

  // 한글 변환 (간단한 매핑)
  for (const [korean, roman] of Object.entries(koreanToRoman)) {
    slug = slug.replace(new RegExp(korean, 'g'), roman);
  }

  // 특수문자 제거 및 공백 → 하이픈
  slug = slug
    .replace(/[^a-z0-9\s-]/g, '') // 영문/숫자/공백/하이픈만 남김
    .replace(/\s+/g, '-') // 공백 → 하이픈
    .replace(/-+/g, '-') // 연속 하이픈 제거
    .replace(/^-|-$/g, ''); // 앞뒤 하이픈 제거

  // 타임스탬프 추가 (중복 방지)
  return `${slug}-${Date.now()}`;
}

export async function POST(request: NextRequest) {
  try {
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
    const validated = createProductSchema.parse(body);

    // 3. 슬러그 자동 생성 (없으면)
    const slug = validated.slug || generateSlug(validated.name);

    // 4. 상품 생성
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name: validated.name,
        slug,
        short_description: validated.short_description || null,
        description: validated.description || null,
        price: validated.price,
        discount_price: validated.discount_price || null,
        category_id: validated.category_id || null,
        status: validated.status,
        is_featured: validated.is_featured,
        metadata: (validated.metadata || {}) as any,
      })
      .select()
      .single();

    if (error) {
      console.error('Product creation error:', error);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: error.message,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: product,
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
// GET /api/admin/products - 상품 목록 조회 (관리자용)
// ============================================================================

/**
 * 쿼리 파라미터 스키마
 */
const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  status: z
    .enum(['draft', 'active', 'archived', 'hidden'])
    .optional(),
  category: z.string().uuid().optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'popular', 'price_asc', 'price_desc']).default('newest'),
});

export async function GET(request: NextRequest) {
  try {
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

    // 2. 쿼리 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const params = querySchema.parse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '12',
      status: searchParams.get('status') || undefined,
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || 'newest',
    });

    // 3. 쿼리 빌더 생성
    let query = supabase
      .from('products')
      .select('*, category:categories(id, name, slug)', { count: 'exact' });

    // 4. 필터 적용
    if (params.status) {
      query = query.eq('status', params.status);
    }

    if (params.category) {
      query = query.eq('category_id', params.category);
    }

    if (params.search) {
      query = query.or(
        `name.ilike.%${params.search}%,description.ilike.%${params.search}%`
      );
    }

    // 5. 정렬
    switch (params.sort) {
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'popular':
        query = query.order('sales_count', { ascending: false });
        break;
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
    }

    // 6. 페이지네이션
    const from = (params.page - 1) * params.limit;
    const to = from + params.limit - 1;
    query = query.range(from, to);

    // 7. 실행
    const { data: products, error, count } = await query;

    if (error) {
      console.error('Products query error:', error);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: error.message,
          },
        },
        { status: 500 }
      );
    }

    // 8. 응답
    return NextResponse.json({
      data: products,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / params.limit),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: '쿼리 파라미터가 올바르지 않습니다.',
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
