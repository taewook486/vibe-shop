/**
 * Admin Inventory Adjust API Route
 *
 * POST /api/admin/inventory/adjust - 재고 조정 (입고/출고/보정)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { z } from 'zod';

// 단일 재고 조정 스키마
const adjustmentSchema = z.object({
  product_id: z.string().uuid('유효하지 않은 상품 ID입니다'),
  quantity: z.number().int('수량은 정수여야 합니다'),
  reason: z.string().min(1, '사유를 입력해주세요'),
});

// 대량 재고 조정 스키마
const bulkAdjustmentSchema = z.object({
  adjustments: z
    .array(adjustmentSchema)
    .min(1, '최소 1개 이상의 조정 항목이 필요합니다'),
});

// 단일 조정 스키마 (최상위 레벨)
const singleAdjustmentSchema = adjustmentSchema.extend({
  adjustments: z.array(adjustmentSchema).optional(),
});

export async function POST(request: NextRequest) {
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

    // 요청 본문 파싱
    const body = await request.json();

    // 대량 조정인지 단일 조정인지 판단
    const isBulk = Array.isArray(body.adjustments);

    if (isBulk) {
      // 대량 재고 조정
      const validation = bulkAdjustmentSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          {
            error: '유효하지 않은 요청입니다',
            details: validation.error.issues,
          },
          { status: 400 }
        );
      }

      const { adjustments } = validation.data;
      const results = [];

      // 각 조정 항목 처리
      for (const adjustment of adjustments) {
        const { product_id, quantity, reason } = adjustment;

        // adjust_stock 함수 호출
        const { data: adjustResult, error: adjustError } = await supabase.rpc(
          'adjust_stock',
          {
            p_product_id: product_id,
            p_new_quantity: quantity,
            p_reason: reason,
          }
        );

        if (adjustError) {
          console.error('재고 조정 오류:', adjustError);
          results.push({
            product_id,
            success: false,
            error: adjustError.message,
          });
          continue;
        }

        // 조정 후 재고 조회
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', product_id)
          .single();

        results.push({
          product_id,
          success: true,
          stock_after: product?.stock || quantity,
        });
      }

      return NextResponse.json({
        success: true,
        data: results,
      });
    } else {
      // 단일 재고 조정
      const validation = singleAdjustmentSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          {
            error: '유효하지 않은 요청입니다',
            details: validation.error.issues,
          },
          { status: 400 }
        );
      }

      const { product_id, quantity, reason } = validation.data;

      // 현재 재고 조회
      const { data: currentProduct, error: currentError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', product_id)
        .single();

      if (currentError || !currentProduct) {
        return NextResponse.json(
          { error: '상품을 찾을 수 없습니다' },
          { status: 404 }
        );
      }

      const stock_before = currentProduct.stock || 0;

      // 음수 재고 검증
      if (quantity < 0) {
        return NextResponse.json(
          { error: '재고는 0 이상이어야 합니다' },
          { status: 400 }
        );
      }

      // adjust_stock 함수 호출
      const { data: adjustResult, error: adjustError } = await supabase.rpc(
        'adjust_stock',
        {
          p_product_id: product_id,
          p_new_quantity: quantity,
          p_reason: reason,
        }
      );

      if (adjustError) {
        console.error('재고 조정 오류:', adjustError);
        return NextResponse.json(
          { error: '재고 조정 실패: ' + adjustError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          product_id,
          stock_before,
          stock_after: quantity,
        },
      });
    }
  } catch (error) {
    console.error('재고 조정 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
