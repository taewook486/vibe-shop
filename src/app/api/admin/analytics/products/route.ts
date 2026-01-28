/**
 * @file src/app/api/admin/analytics/products/route.ts
 * @description 상품별 매출 순위 API
 * @task P7-T7.4
 *
 * GET /api/admin/analytics/products
 * - 상품별 매출 순위
 * - 기간 필터 지원
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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // 기간 필터 쿼리 빌드
    let ordersQuery = supabase
      .from('order_items')
      .select(
        `
        product_id,
        product_name,
        price,
        quantity,
        orders!inner (
          id,
          status,
          paid_at
        )
      `
      )
      .eq('orders.status', 'paid');

    if (startDate) {
      ordersQuery = ordersQuery.gte('orders.paid_at', `${startDate}T00:00:00`);
    }
    if (endDate) {
      ordersQuery = ordersQuery.lte('orders.paid_at', `${endDate}T23:59:59`);
    }

    const { data: orderItems, error } = await ordersQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!orderItems) {
      return NextResponse.json({ products: [], total: 0 });
    }

    // 상품별 매출 집계
    const productStats = new Map<
      string,
      {
        productId: string;
        productName: string;
        revenue: number;
        orderCount: number;
        quantitySold: number;
      }
    >();

    orderItems.forEach((item: any) => {
      const productId = item.product_id;
      if (!productId) return;

      const existing = productStats.get(productId) || {
        productId,
        productName: item.product_name,
        revenue: 0,
        orderCount: 0,
        quantitySold: 0,
      };

      existing.revenue += item.price * item.quantity;
      existing.orderCount += 1;
      existing.quantitySold += item.quantity;

      productStats.set(productId, existing);
    });

    // 매출 순으로 정렬
    const products = Array.from(productStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);

    return NextResponse.json({
      products,
      total: productStats.size,
    });
  } catch (error) {
    console.error('Product analytics error:', error);
    return NextResponse.json(
      { error: '상품별 매출 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
