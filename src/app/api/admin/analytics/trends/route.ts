/**
 * @file src/app/api/admin/analytics/trends/route.ts
 * @description 매출 추이 시계열 데이터 API
 * @task P7-T7.4
 *
 * GET /api/admin/analytics/trends
 * - 매출 추이 (일/주/월 단위)
 * - 시계열 데이터 반환
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
    const interval = (searchParams.get('interval') || 'day') as 'day' | 'week' | 'month';

    // 기본 기간 설정 (최근 30일)
    const today = new Date();
    const defaultEndDate = today.toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const defaultStartDate = thirtyDaysAgo.toISOString().split('T')[0];

    const queryStartDate = startDate || defaultStartDate;
    const queryEndDate = endDate || defaultEndDate;

    // 주문 데이터 조회
    const { data: orders, error } = await supabase
      .from('orders')
      .select('total_amount, discount_amount, paid_at')
      .eq('status', 'paid')
      .gte('paid_at', `${queryStartDate}T00:00:00`)
      .lte('paid_at', `${queryEndDate}T23:59:59`)
      .order('paid_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!orders) {
      return NextResponse.json({
        trends: [],
        period: { start: queryStartDate, end: queryEndDate, interval },
      });
    }

    // 날짜별 매출 집계
    const trendsMap = new Map<
      string,
      {
        date: string;
        revenue: number;
        orderCount: number;
      }
    >();

    orders.forEach((order) => {
      if (!order.paid_at) return;
      const paidAt = new Date(order.paid_at);
      let dateKey: string;

      if (interval === 'month') {
        // 월 단위: YYYY-MM
        dateKey = `${paidAt.getFullYear()}-${String(paidAt.getMonth() + 1).padStart(2, '0')}`;
      } else if (interval === 'week') {
        // 주 단위: 해당 주의 월요일 날짜
        const monday = new Date(paidAt);
        const day = monday.getDay();
        const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
        monday.setDate(diff);
        dateKey = monday.toISOString().split('T')[0];
      } else {
        // 일 단위: YYYY-MM-DD
        dateKey = paidAt.toISOString().split('T')[0];
      }

      const existing = trendsMap.get(dateKey) || {
        date: dateKey,
        revenue: 0,
        orderCount: 0,
      };

      existing.revenue += order.total_amount - order.discount_amount;
      existing.orderCount += 1;

      trendsMap.set(dateKey, existing);
    });

    // 날짜순 정렬
    const trends = Array.from(trendsMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    // 빈 날짜 채우기 (선택적)
    const filledTrends = fillMissingDates(
      trends,
      queryStartDate,
      queryEndDate,
      interval
    );

    return NextResponse.json({
      trends: filledTrends,
      period: {
        start: queryStartDate,
        end: queryEndDate,
        interval,
      },
    });
  } catch (error) {
    console.error('Trends analytics error:', error);
    return NextResponse.json(
      { error: '매출 추이 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

/**
 * 빈 날짜를 0 매출로 채워서 반환
 */
function fillMissingDates(
  trends: Array<{ date: string; revenue: number; orderCount: number }>,
  startDate: string,
  endDate: string,
  interval: 'day' | 'week' | 'month'
): Array<{ date: string; revenue: number; orderCount: number }> {
  const trendsMap = new Map(trends.map((t) => [t.date, t]));
  const filled: Array<{ date: string; revenue: number; orderCount: number }> = [];

  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    let dateKey: string;

    if (interval === 'month') {
      dateKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
    } else if (interval === 'week') {
      const monday = new Date(current);
      const day = monday.getDay();
      const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
      monday.setDate(diff);
      dateKey = monday.toISOString().split('T')[0];
    } else {
      dateKey = current.toISOString().split('T')[0];
    }

    filled.push(
      trendsMap.get(dateKey) || {
        date: dateKey,
        revenue: 0,
        orderCount: 0,
      }
    );

    // 다음 기간으로 이동
    if (interval === 'month') {
      current.setMonth(current.getMonth() + 1);
    } else if (interval === 'week') {
      current.setDate(current.getDate() + 7);
    } else {
      current.setDate(current.getDate() + 1);
    }
  }

  return filled;
}
