/**
 * P7-T7.8: 쿠폰 생성 페이지
 *
 * 기능:
 * - 쿠폰 생성 폼
 *
 * 권한: 관리자 전용
 */

import CouponForm from '@/components/admin/coupon-form';

export default async function NewCouponPage() {
  // 참고: middleware.ts에서 이미 관리자 권한 체크 완료

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">쿠폰 생성</h1>
          <p className="text-muted-foreground mt-2">
            새로운 쿠폰을 생성합니다.
          </p>
        </div>

        <CouponForm mode="create" />
      </div>
    </div>
  );
}
