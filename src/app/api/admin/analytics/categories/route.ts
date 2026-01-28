/**
 * @file src/app/api/admin/analytics/categories/route.ts
 * @description 카테고리별 매출 API
 * @task P7-T7.4
 *
 * GET /api/admin/analytics/categories
 * - 카테고리별 매출 집계
 * - 비중 계산 포함
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

    // 주문 데이터 조회 with product & category
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
        ),
        products (
          category_id,
          categories (
            id,
            name
          )
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
      return NextResponse.json({ categories: [], totalRevenue: 0 });
    }

    // 카테고리별 매출 집계
    const categoryStats = new Map<
      string,
      {
        categoryId: string;
        categoryName: string;
        revenue: number;
        orderCount: number;
      }
    >();

    let totalRevenue = 0;

    orderItems.forEach((item: any) => {
      const category = item.products?.categories;
      if (!category) return;

      const revenue = item.price * item.quantity;
      totalRevenue += revenue;

      const categoryId = category.id;
      const existing = categoryStats.get(categoryId) || {
        categoryId,
        categoryName: category.name,
        revenue: 0,
        orderCount: 0,
      };

      existing.revenue += revenue;
      existing.orderCount += 1;

      categoryStats.set(categoryId, existing);
    });

    // 매출 순으로 정렬 & 비중 계산
    const categories = Array.from(categoryStats.values())
      .map((cat) => ({
        ...cat,
        percentage: totalRevenue > 0 ? Math.round((cat.revenue / totalRevenue) * 100) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    return NextResponse.json({
      categories,
      totalRevenue,
    });
  } catch (error) {
    console.error('Category analytics error:', error);
    return NextResponse.json(
      { error: '카테고리별 매출 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
