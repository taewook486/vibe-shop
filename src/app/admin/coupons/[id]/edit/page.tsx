/**
 * P7-T7.8: 쿠폰 수정 페이지
 *
 * 기능:
 * - 쿠폰 수정 폼
 *
 * 권한: 관리자 전용
 */

import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import CouponForm from '@/components/admin/coupon-form';

interface CouponEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CouponEditPage({ params }: CouponEditPageProps) {
  const { id } = await params;

  // 참고: middleware.ts에서 이미 관리자 권한 체크 완료

  // Supabase 클라이언트 생성 (DB 접근용)
  const supabase = await createServerClient();

  // 쿠폰 조회
  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !coupon) {
    redirect('/admin/coupons');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">쿠폰 수정</h1>
          <p className="text-muted-foreground mt-2">
            쿠폰 정보를 수정합니다.
          </p>
        </div>

        <CouponForm initialData={coupon} mode="edit" />
      </div>
    </div>
  );
}
