/**
 * Inquiries API Route
 *
 * GET /api/inquiries - 문의 목록 조회 (비밀글 필터링)
 * POST /api/inquiries - 문의 작성
 *
 * Features:
 * - 비밀글은 작성자/관리자만 조회 (RLS 정책)
 * - 페이지네이션, 필터링, 정렬 지원
 * - 카테고리별/상태별 필터
 * - 작성자 정보 포함
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';
import { CreateInquirySchema, InquiryFilterSchema } from '@/types/inquiry';

/**
 * GET /api/inquiries
 * 문의 목록 조회 (비밀글 필터링)
 *
 * Query Params:
 * - page: 페이지 번호 (default: 1)
 * - limit: 페이지당 개수 (default: 20)
 * - product_id: 상품별 필터
 * - category: 카테고리 필터 (product/shipping/payment/etc)
 * - status: 상태 필터 (pending/answered)
 * - search: 제목/내용 검색
 * - sort_by: 정렬 (latest/oldest/unanswered/most_viewed)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const searchParams = request.nextUrl.searchParams;

    // 쿼리 파라미터 파싱 및 검증
    const filterParams = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      product_id: searchParams.get('product_id') || undefined,
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
      sort_by: searchParams.get('sort_by') || 'latest',
    };

    // Zod 스키마 검증
    const validated = InquiryFilterSchema.safeParse(filterParams);
    if (!validated.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: validated.error.issues,
          },
        },
        { status: 400 }
      );
    }

    const { page, limit, product_id, category, status, search, sort_by } = validated.data;

    // 쿼리 빌더 시작 (작성자 정보 포함)
    let query = supabase
      .from('inquiries')
      .select(
        `
        *,
        author:profiles!inquiries_user_id_fkey (
          id,
          email,
          nickname,
          avatar_url
        ),
        product:products (
          id,
          name,
          slug
        )
      `,
        { count: 'exact' }
      );

    // 필터 적용
    if (product_id) {
      query = query.eq('product_id', product_id);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      // 제목 또는 내용 검색
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // 정렬 적용
    switch (sort_by) {
      case 'latest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'unanswered':
        query = query.eq('status', 'pending').order('created_at', { ascending: false });
        break;
      case 'most_viewed':
        query = query.order('view_count', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // 페이지네이션 적용
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // 실행
    const { data: inquiries, error, count } = await query;

    if (error) {
      console.error('Inquiries fetch error:', error);
      return NextResponse.json(
        { error: { code: 'FETCH_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    // 응답 생성
    const response = {
      inquiries: inquiries || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Inquiries API error:', error);
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

/**
 * POST /api/inquiries
 * 문의 작성
 *
 * Body:
 * - product_id: 상품 ID (nullable)
 * - category: 카테고리 (product/shipping/payment/etc)
 * - title: 제목
 * - content: 내용
 * - is_private: 비밀글 여부 (default: false)
 *
 * Requirements:
 * - 로그인 필수 (auth.uid())
 * - RLS 정책으로 user_id 자동 설정
 */
export async function POST(request: NextRequest) {
  try {
    // NextAuth 세션 확인
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    // 요청 바디 파싱
    const body = await request.json();

    // Zod 스키마 검증
    const validated = CreateInquirySchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: validated.error.issues,
          },
        },
        { status: 400 }
      );
    }

    const { product_id, category, title, content, is_private } = validated.data;

    // product_id가 있으면 상품 존재 여부 확인
    if (product_id) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id')
        .eq('id', product_id)
        .single();

      if (productError || !product) {
        return NextResponse.json(
          { error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found' } },
          { status: 404 }
        );
      }
    }

    // 문의 생성
    const { data: inquiry, error: insertError } = await supabase
      .from('inquiries')
      .insert({
        product_id,
        user_id: userId,
        category,
        title,
        content,
        is_private: is_private || false,
        status: 'pending',
      })
      .select(
        `
        *,
        author:profiles!inquiries_user_id_fkey (
          id,
          email,
          nickname,
          avatar_url
        ),
        product:products (
          id,
          name,
          slug
        )
      `
      )
      .single();

    if (insertError) {
      console.error('Inquiry creation error:', insertError);
      return NextResponse.json(
        { error: { code: 'CREATE_ERROR', message: insertError.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (error) {
    console.error('Inquiry creation error:', error);
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
