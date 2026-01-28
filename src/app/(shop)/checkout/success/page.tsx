/**
 * Checkout Success Page (P3-T3.4)
 *
 * 결제 완료 페이지
 * - URL 파라미터에서 orderId, paymentKey, amount 추출
 * - 주문 확인 및 결제 성공 메시지
 * - 다운로드 센터 링크
 * - 비회원일 경우 회원 가입 유도
 */

import { Suspense } from 'react';
import CheckoutSuccessContent from './checkout-success-content';

interface CheckoutSuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
    paymentKey?: string;
    amount?: string;
  }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  // Next.js 15: searchParams is a Promise
  const params = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neo-cream flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-neo-black border-t-transparent"></div>
            <p className="mt-4 text-neo-black font-bold">결제 확인 중...</p>
          </div>
        </div>
      }
    >
      <CheckoutSuccessContent searchParams={params} />
    </Suspense>
  );
}
