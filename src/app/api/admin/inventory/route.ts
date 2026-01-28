/**
 * Admin Inventory API Route
 *
 * GET /api/admin/inventory - 재고 현황 목록 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // 관리자 권한 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
    }

    // 쿼리 파라미터
    const searchParams = request.nextUrl.searchParams;
    const lowStock = searchParams.get('low_stock') === 'true';
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // 재고 목록 조회
    let query = supabase
      .from('products')
      .select(
        `
        id,
        name,
        slug,
        stock,
        stock_alert_threshold,
        status,
        price,
        created_at,
        updated_at
      `,
        { count: 'exact' }
      )
      .order('name', { ascending: true });

    // 부족 재고 필터
    if (lowStock) {
      // Use a more robust approach for low stock filtering
      // Since we can't directly compare columns in a single filter,
      // we'll need to fetch and filter, or use a custom function
      // For now, we'll use the get_low_stock_products function instead
      const { data: lowStockProducts, error: lowStockError } = await supabase
        .rpc('get_low_stock_products');

      if (lowStockError) {
        console.error('부족 재고 조회 오류:', lowStockError);
        return NextResponse.json(
          { error: '부족 재고 조회 실패' },
          { status: 500 }
        );
      }

      // Apply search filter if provided
      let filteredProducts = lowStockProducts || [];
      if (search) {
        filteredProducts = filteredProducts.filter((p: { name: string }) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply pagination
      const total = filteredProducts.length;
      const from = (page - 1) * limit;
      const to = from + limit;
      const paginatedProducts = filteredProducts.slice(from, to);

      return NextResponse.json({
        data: paginatedProducts,
        meta: {
          total,
          page,
          limit,
        },
      });
    }

    // 상품명 검색
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: products, error, count } = await query;

    if (error) {
      console.error('재고 목록 조회 오류:', error);
      return NextResponse.json(
        { error: '재고 목록 조회 실패' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: products || [],
      meta: {
        total: count || 0,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('재고 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
