/**
 * @file src/app/api/admin/analytics/summary/route.ts
 * @description 기간별 매출 요약 API
 * @task P7-T7.4
 *
 * GET /api/admin/analytics/summary
 * - 기간별 매출 요약 (일/주/월/년)
 * - 전년/전월 대비 비교 지원
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

interface SummaryQueryParams {
  period?: 'day' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
  compare?: boolean;
}

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

    // 쿼리 파라미터 파싱
    const searchParams = request.nextUrl.searchParams;
    const period = (searchParams.get('period') || 'day') as 'day' | 'week' | 'month' | 'year';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const compare = searchParams.get('compare') === 'true';

    // 기본 기간 설정 (오늘)
    const today = new Date();
    const defaultEndDate = today.toISOString().split('T')[0];
    const defaultStartDate = defaultEndDate;

    const currentStartDate = startDate || defaultStartDate;
    const currentEndDate = endDate || defaultEndDate;

    // 현재 기간 매출 요약
    const { data: currentOrders, error } = await supabase
      .from('orders')
      .select('total_amount, discount_amount, paid_at')
      .eq('status', 'paid')
      .gte('paid_at', `${currentStartDate}T00:00:00`)
      .lte('paid_at', `${currentEndDate}T23:59:59`);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 매출 집계
    const totalRevenue = currentOrders.reduce(
      (sum, order) => sum + (order.total_amount - order.discount_amount),
      0
    );
    const orderCount = currentOrders.length;
    const averageOrderValue = orderCount > 0 ? Math.round(totalRevenue / orderCount) : 0;

    const currentSummary = {
      totalRevenue,
      orderCount,
      averageOrderValue,
      period: {
        start: currentStartDate,
        end: currentEndDate,
      },
    };

    // 비교 기간 계산
    if (!compare) {
      return NextResponse.json(currentSummary);
    }

    // 비교 기간 계산 (전월/전년)
    const start = new Date(currentStartDate);
    const end = new Date(currentEndDate);
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const previousStart = new Date(start);
    const previousEnd = new Date(end);

    if (period === 'year') {
      previousStart.setFullYear(previousStart.getFullYear() - 1);
      previousEnd.setFullYear(previousEnd.getFullYear() - 1);
    } else if (period === 'month') {
      previousStart.setMonth(previousStart.getMonth() - 1);
      previousEnd.setMonth(previousEnd.getMonth() - 1);
    } else {
      // day, week
      previousStart.setDate(previousStart.getDate() - daysDiff);
      previousEnd.setDate(previousEnd.getDate() - daysDiff);
    }

    const previousStartDate = previousStart.toISOString().split('T')[0];
    const previousEndDate = previousEnd.toISOString().split('T')[0];

    // 이전 기간 매출 요약
    const { data: previousOrders } = await supabase
      .from('orders')
      .select('total_amount, discount_amount, paid_at')
      .eq('status', 'paid')
      .gte('paid_at', `${previousStartDate}T00:00:00`)
      .lte('paid_at', `${previousEndDate}T23:59:59`);

    const previousRevenue = previousOrders?.reduce(
      (sum, order) => sum + (order.total_amount - order.discount_amount),
      0
    ) || 0;
    const previousOrderCount = previousOrders?.length || 0;
    const previousAverageOrderValue =
      previousOrderCount > 0 ? Math.round(previousRevenue / previousOrderCount) : 0;

    // 변화율 계산
    const revenueChangePercent =
      previousRevenue > 0
        ? Math.round(((totalRevenue - previousRevenue) / previousRevenue) * 100)
        : 0;
    const orderCountChangePercent =
      previousOrderCount > 0
        ? Math.round(((orderCount - previousOrderCount) / previousOrderCount) * 100)
        : 0;

    return NextResponse.json({
      current: currentSummary,
      previous: {
        totalRevenue: previousRevenue,
        orderCount: previousOrderCount,
        averageOrderValue: previousAverageOrderValue,
        period: {
          start: previousStartDate,
          end: previousEndDate,
        },
      },
      changePercent: {
        revenue: revenueChangePercent,
        orderCount: orderCountChangePercent,
      },
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    return NextResponse.json(
      { error: '매출 요약 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
