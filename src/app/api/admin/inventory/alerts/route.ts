/**
 * Admin Inventory Alerts API Route
 *
 * GET /api/admin/inventory/alerts - 재고 부족 알림 목록 조회
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

    // get_low_stock_products 함수 호출
    const { data: lowStockProducts, error } = await supabase.rpc(
      'get_low_stock_products'
    );

    if (error) {
      console.error('재고 부족 알림 조회 오류:', error);
      return NextResponse.json(
        { error: '재고 부족 알림 조회 실패' },
        { status: 500 }
      );
    }

    // 긴급도 계산 및 추가 정보 포함
    const alerts = (lowStockProducts || []).map((product: any) => {
      const urgencyRatio =
        product.stock_alert_threshold > 0
          ? product.stock / product.stock_alert_threshold
          : 0;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        stock: product.stock,
        stock_alert_threshold: product.stock_alert_threshold,
        status: product.status,
        urgency_ratio: urgencyRatio,
        urgency_level:
          urgencyRatio === 0
            ? 'critical'
            : urgencyRatio < 0.5
            ? 'high'
            : urgencyRatio < 1
            ? 'medium'
            : 'low',
      };
    });

    return NextResponse.json({
      data: alerts,
      meta: {
        total: alerts.length,
      },
    });
  } catch (error) {
    console.error('재고 부족 알림 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
